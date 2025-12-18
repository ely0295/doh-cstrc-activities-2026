const owner = "ely0295";
const repo = "doh-cstrc-activities-2026";
const path = "json/activities_with_id.json";
const token = "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";

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

async function getData() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  const content = JSON.parse(atob(data.content));
  render(content);
  return { content, sha: data.sha };
}

function render(items) {
  const list = document.getElementById("list");
  list.innerHTML = "";
  items.forEach(item => {
    list.innerHTML += `
      <li>
        ${item.DATE} (${item.ACTIVITY}) ${item.VENUE} - ${item.PROPONENT} - ${item.ATTENDEES}
        <button onclick="deleteItem(${item.id})">❌</button>
      </li>`;
  });
}

async function addItem() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const venue = document.getElementById("venue").value;
  const proponent = document.getElementById("proponent").value;
  const attendees = document.getElementById("attendees").value;
  const { content, sha } = await getData();
  content.push({ id: Date.now(), date, title,venue,proponent,attendees });

  updateFile(content, sha);
}

async function deleteItem(id) {
  const { content, sha } = await getData();
  const updated = content.filter(item => item.id !== id);
  updateFile(updated, sha);
}

async function updateFile(content, sha) {
  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update JSON data",
      content: btoa(JSON.stringify(content, null, 2)),
      sha
    })
  });

  alert("Updated!");
  location.reload();
}

getData();
