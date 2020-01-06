let saveTimeout = null;

const saveOptions = () => {
  const name = document.getElementById('name').value;

  chrome.storage.sync.set(
    {
      name: name,
    },
    () => {
      const status = document.getElementById('status');
      
      status.textContent = 'Options saved.';

      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(
        () => {
          status.textContent = '';
        },
        2000,
      );
    },
  );
}
  
const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      name: '',
    },
    settings => {
      const name = document.getElementById('name');
      name.value = settings.name;
    },
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);