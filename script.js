document.getElementById('loadFromFile').addEventListener('click', handleFileSelect);
document.getElementById('liveSelect').addEventListener('change', handleChannelSelect);
document.getElementById('moviesSelect').addEventListener('change', handleChannelSelect);
document.getElementById('seriesSelect').addEventListener('change', handleChannelSelect);

function handleFileSelect() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('يرجى تحميل ملف xtreamiptv');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        parseXtreamFile(contents);
    };
    reader.readAsText(file);
}

function parseXtreamFile(contents) {
    const lines = contents.split('\n');
    const serverUrl = lines[0].trim();
    const username = lines[1].trim();
    const password = lines[2].trim();

    if (!serverUrl || !username || !password) {
        alert('الملف غير صالح');
        return;
    }

    const liveApiUrl = `${serverUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`;
    const moviesApiUrl = `${serverUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`;
    const seriesApiUrl = `${serverUrl}/player_api.php?username=${username}&password=${password}&action=get_series`;

    fetch(liveApiUrl)
        .then(response => response.json())
        .then(data => populateSelect('liveSelect', data))
        .catch(error => console.error('Error:', error));

    fetch(moviesApiUrl)
        .then(response => response.json())
        .then(data => populateSelect('moviesSelect', data))
        .catch(error => console.error('Error:', error));

    fetch(seriesApiUrl)
        .then(response => response.json())
        .then(data => populateSelect('seriesSelect', data))
        .catch(error => console.error('Error:', error));
}

function populateSelect(selectId, items) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">اختر...</option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.stream_id || item.series_id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

function handleChannelSelect(event) {
    const serverUrl = document.getElementById('fileInput').files[0].name.split('\n')[0].trim();
    const username = document.getElementById('fileInput').files[0].name.split('\n')[1].trim();
    const password = document.getElementById('fileInput').files[0].name.split('\n')[2].trim();
    const streamId = event.target.value;
    const selectId = event.target.id;

    let videoUrl = '';
    if (selectId === 'liveSelect' && streamId) {
        videoUrl = `${serverUrl}/live/${username}/${password}/${streamId}.m3u8`;
    } else if (selectId === 'moviesSelect' && streamId) {
        videoUrl = `${serverUrl}/movie/${username}/${password}/${streamId}.m3u8`;
    } else if (selectId === 'seriesSelect' && streamId) {
        videoUrl = `${serverUrl}/series/${username}/${password}/${streamId}.m3u8`;
    }

    const videoPlayer = document.getElementById('videoPlayer');
    if (videoUrl) {
        videoPlayer.src = videoUrl;
        videoPlayer.play();
    } else {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}
