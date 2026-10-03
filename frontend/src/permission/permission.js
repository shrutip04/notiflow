const button = document.getElementById('allow')
const result = document.getElementById('result')

button.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((t) => t.stop()) // we only needed the permission grant
        result.textContent = 'Microphone allowed. Close this tab and open Voice in the Notiflow popup.'
    } catch (e) {
        result.textContent = `Not allowed (${e.name}). Allow the microphone for this page in the address bar, then try again.`
    }
})