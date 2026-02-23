const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`http://localhost:5000/api/gifts/${id}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('giftMessage').innerText = data.message;
    if (data.videoUrl) {
      document.getElementById('videoPlayer').src = data.videoUrl;
    }
  });
