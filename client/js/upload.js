document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('message', document.getElementById('message').value);
  const file = document.getElementById('video').files[0];
  if (file) formData.append('video', file);

  const res = await fetch('http://localhost:5000/api/gifts', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  document.getElementById('result').innerHTML =
    `<p>QR Generated:</p><img src="${data.qr}" width="200"/>`;
});
