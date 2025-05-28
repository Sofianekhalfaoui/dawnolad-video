async function fetchInfo() {
  const url = document.getElementById("urlInput").value;
  const status = document.getElementById("status");
  const infoDiv = document.getElementById("videoInfo");
  const title = document.getElementById("videoTitle");
  const thumb = document.getElementById("thumbnail");

  if (!url) {
    status.textContent = "يرجى إدخال رابط.";
    return;
  }

  status.textContent = "جاري جلب معلومات الفيديو...";

  const res = await fetch('/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  if (res.ok) {
    const data = await res.json();
    title.textContent = data.title;
    thumb.src = data.thumbnail;
    infoDiv.style.display = "block";
    status.textContent = "";
  } else {
    status.textContent = "لم نتمكن من جلب المعلومات.";
  }
}

async function download() {
  const url = document.getElementById("urlInput").value;
  const format = document.getElementById("formatSelect").value;
  const status = document.getElementById("status");

  if (!url) {
    status.textContent = "يرجى إدخال رابط.";
    return;
  }

  status.textContent = "جاري التحميل...";

  const res = await fetch('/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format })
  });

  if (res.ok) {
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (format === "mp3") ? "audio.mp3" : "video.mp4";
    a.click();
    status.textContent = "تم التحميل!";
  } else {
    status.textContent = "فشل التحميل.";
  }
}