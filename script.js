/**
 * ==========================================================================
 * SERVER NOT CONNECTED - JAVASCRIPT SYSTEM (DISCONNECTED ONLY)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let countdown = 10;
    let isPaused = false;
    let timerInterval = null;

    // Elements
    const timerEl = document.getElementById('timer');
    const progressBar = document.getElementById('progressBar');
    const pauseBtn = document.getElementById('pauseBtn');
    const retryNowBtn = document.getElementById('retryNowBtn');
    const checkConnBtn = document.getElementById('checkConnBtn');
    const accToggle = document.getElementById('accToggle');
    const accBody = document.getElementById('accBody');
    const copyBtn = document.getElementById('copyBtn');
    const timestampEl = document.getElementById('timestamp');
    const toast = document.getElementById('toast');

    // 1. Live Timestamp
    function updateTimestamp() {
        if (timestampEl) {
            const now = new Date();
            timestampEl.textContent = now.toLocaleTimeString();
        }
    }
    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // 2. Toast Notification Function
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // 3. Countdown & Progress (Always stays in disconnected state)
    function startTimer() {
        clearInterval(timerInterval);
        countdown = 10;
        updateProgress();

        timerInterval = setInterval(() => {
            if (!isPaused) {
                countdown--;
                if (countdown < 0) {
                    performRetry();
                    countdown = 10;
                }
                updateProgress();
            }
        }, 1000);
    }

    function updateProgress() {
        if (timerEl) timerEl.textContent = countdown;
        if (progressBar) {
            const percent = ((10 - countdown) / 10) * 100;
            progressBar.style.width = `${percent}%`;
        }
    }

    startTimer();

    // 4. Pause / Resume Button
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                pauseBtn.textContent = 'Resume';
                showToast('Auto-retry countdown paused');
            } else {
                pauseBtn.textContent = 'Pause';
                showToast('Auto-retry countdown resumed');
            }
        });
    }

    // 5. Retry Action (Always Disconnected Result)
    function performRetry() {
        showToast('Connecting to server gateway...');
        if (retryNowBtn) {
            retryNowBtn.innerHTML = `
                <svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                    <path d="M16 21h5v-5"/>
                </svg>
                <span>Connecting...</span>
            `;
            retryNowBtn.disabled = true;
        }

        setTimeout(() => {
            if (retryNowBtn) {
                retryNowBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>
                    <span>Retry Now</span>
                `;
                retryNowBtn.disabled = false;
            }

            showToast('Server unreachable (503 Service Unavailable). Retrying in 10s...');
        }, 1100);
    }

    if (retryNowBtn) {
        retryNowBtn.addEventListener('click', () => {
            countdown = 10;
            updateProgress();
            performRetry();
        });
    }

    // 6. Check Local Connection Button
    if (checkConnBtn) {
        checkConnBtn.addEventListener('click', () => {
            checkConnBtn.disabled = true;
            checkConnBtn.style.opacity = '0.7';

            setTimeout(() => {
                checkConnBtn.disabled = false;
                checkConnBtn.style.opacity = '1';

                if (navigator.onLine) {
                    showToast('Local Network: ONLINE (Target server is offline)');
                } else {
                    showToast('Local Network: OFFLINE (Check your Wi-Fi/Ethernet)');
                }
            }, 600);
        });
    }

    // 7. Technical Accordion
    if (accToggle && accBody) {
        accToggle.addEventListener('click', () => {
            const isOpen = accBody.classList.contains('open');
            if (isOpen) {
                accBody.classList.remove('open');
                accToggle.classList.remove('open');
            } else {
                accBody.classList.add('open');
                accToggle.classList.add('open');
            }
        });
    }

    // 8. Copy Diagnostic Code
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const payload = `Error: 503 Service Unavailable | Code: ERR_CONNECTION_TIMED_OUT | Host: api.cloudnode.internal | Time: ${timestampEl ? timestampEl.textContent : ''}`;
            navigator.clipboard.writeText(payload).then(() => {
                showToast('Diagnostic payload copied to clipboard!');
            }).catch(() => {
                showToast('Copied to clipboard');
            });
        });
    }
});
