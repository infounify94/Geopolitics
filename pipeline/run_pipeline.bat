@echo off
:: SignalAtlas Pipeline Runner
:: API keys are loaded from .env file — NEVER hardcode secrets here
cd /d d:\Geopolitics\pipeline

:: Load .env if it exists
if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set %%a=%%b
    )
)

set ARTICLES_PER_RUN=5
set DELAY_BETWEEN_SECS=45
python scheduler.py >> d:\Geopolitics\pipeline\pipeline.log 2>&1
