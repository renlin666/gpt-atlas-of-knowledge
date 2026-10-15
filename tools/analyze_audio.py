"""Measure the licensed local soundtrack with FFmpeg and NumPy.

Usage: python tools/analyze_audio.py --ffmpeg PATH
The spectral peaks are onset candidates, not asserted musical downbeats.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', required=True)
args = parser.parse_args()
source = Path('assets/audio/Aphelion.mp3')
sr, hop, size = 22050, 256, 2048
decoded = subprocess.run([args.ffmpeg, '-v', 'error', '-i', str(source), '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], check=True, capture_output=True)
if decoded.stderr.strip():
    raise RuntimeError(decoded.stderr.decode(errors='replace'))
audio = np.frombuffer(decoded.stdout, dtype='<f4')
opening = audio[:sr*60]
frames = np.lib.stride_tricks.sliding_window_view(opening, size)[::hop]
spectrum = np.abs(np.fft.rfft(frames*np.hanning(size), axis=1))
flux = np.maximum(np.diff(np.log1p(spectrum), axis=0), 0).mean(axis=1)
flux = np.r_[0, flux]
flux /= max(float(np.percentile(flux, 99)), 1e-9)
times = (np.arange(len(flux))*hop+size/2)/sr
candidates = []
for i in range(2, len(flux)-2):
    lo, hi = max(0,i-25), min(len(flux),i+26)
    threshold = np.median(flux[lo:hi])+max(.08,float(np.std(flux[lo:hi]))*.65)
    if flux[i] == max(flux[i-2:i+3]) and flux[i] > threshold:
        if candidates and times[i]-candidates[-1]['time'] < .28:
            if flux[i] <= candidates[-1]['strength']:
                continue
            candidates.pop()
        candidates.append({'time':round(float(times[i]),4),'strength':round(float(flux[i]),4)})
seconds = [{'time':i,'rmsDb':round(float(20*np.log10(max(np.sqrt(np.mean(audio[i*sr:(i+1)*sr]**2)),1e-9))),2)} for i in range(min(60,len(audio)//sr))]
strong_times = np.array([c['time'] for c in candidates if c['strength']>.55])
intervals = np.diff(strong_times)
period = float(np.median(intervals[(intervals>.65)&(intervals<.85)]))
indices = np.rint(strong_times/period)
fit = np.polyfit(indices,strong_times,1)
inliers = np.abs(strong_times-np.polyval(fit,indices))<.06
fit = np.polyfit(indices[inliers],strong_times[inliers],1)
report = {
    'track':'Aphelion','author':'Scott Buckley',
    'source':'https://www.scottbuckley.com.au/library/aphelion/',
    'license':'CC BY 4.0',
    'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
    'decodedDuration':round(len(audio)/sr,6),'sampleRate':sr,
    'openingAnalysisSeconds':60,'window':size,'hop':hop,
    'estimatedOpeningPulse':{'periodSeconds':round(float(fit[0]),6),'bpm':round(float(60/fit[0]),3),'phaseSeconds':round(float(fit[1]),4),'inlierCount':int(inliers.sum()),'scope':'Estimated opening pulse only, not an automatic assertion of whole-track tempo or bar numbering.'},
    'method':'Positive log-spectral flux with adaptive local peak threshold; detected attacks are not automatic beat/downbeat claims.',
    'onsetCandidates':candidates,'rmsPerSecond':seconds
}
Path('data/audio-analysis.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:report[k] for k in ['sha256','decodedDuration','onsetCandidates','rmsPerSecond']},ensure_ascii=False))
