export let openNodeModal;

export function initNodeModal() {
  const modalEl     = document.getElementById('nodeModal');
  const bootstrapModal = new bootstrap.Modal(modalEl);
  const form        = document.getElementById('modalNodeForm');
  const idInput     = document.getElementById('modalNodeId');
  const titleInput  = document.getElementById('modalNodeTitle');
  const textInput   = document.getElementById('modalNodeText');
  const labelEl     = document.getElementById('nodeModalLabel');
  let saveCallback  = null;

  // Expose this to the outside:
  openNodeModal = function(data = {}, onSave) {
    idInput.value       = data.id || '';
    titleInput.value    = data.title || '';
    textInput.value     = data.text  || '';
    labelEl.textContent = data.id ? 'Edit Node' : 'New Node';
    saveCallback        = onSave;
    bootstrapModal.show();
  };

  // Handle form submit once
  form.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      id:    idInput.value,
      title: titleInput.value.trim(),
      text:  textInput.value.trim(),
    };
    if (typeof saveCallback === 'function') saveCallback(updated);
    bootstrapModal.hide();
  });
}
