/* Email sign-up for The Connected Child Field Notes.
   One Kit form per world. Each Kit form sends that world's kit automatically
   (Kit form settings → Incentive email → Download) and tags the subscriber.
   Paste each form's ID below (Kit → Grow → Landing Pages & Forms → open form → the number in the URL).
   While an ID is empty, the form shows a preview message and sends nothing. */
const KIT_FORMS = {
  inner: '',
  living: '',
  moving: '',
  imagined: '',
  wondering: '',
  social: ''
};

function ccValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function ccSubscribe(world, email, firstName, extraFields) {
  const id = KIT_FORMS[world];
  if (!id) return Promise.resolve('preview');
  const body = new URLSearchParams();
  body.append('email_address', email.trim());
  if (firstName) body.append('first_name', firstName.trim());
  Object.entries(extraFields || {}).forEach(([k, v]) => body.append('fields[' + k + ']', v));
  // no-cors: Kit accepts the sign-up; the browser just can't read the reply.
  return fetch('https://app.kit.com/forms/' + id + '/subscriptions', { method: 'POST', mode: 'no-cors', body })
    .then(() => 'ok').catch(() => 'error');
}

function ccMessage(el, result) {
  el.textContent = result === 'ok'
    ? 'Almost there! Check your inbox and confirm your email. Your kit will follow right away.'
    : result === 'preview'
      ? 'Preview only: sign-up is not connected yet.'
      : 'Something went wrong. Please try again in a moment.';
}

/* World pages: <form id="pack-form" data-world="inner"> */
const ccPack = document.getElementById('pack-form');
if (ccPack) ccPack.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('pack-email');
  const t = document.getElementById('pack-thanks');
  if (!ccValidEmail(email.value)) { t.textContent = 'Please check your email address.'; email.focus(); return; }
  ccSubscribe(ccPack.dataset.world, email.value).then(r => ccMessage(t, r));
});

/* Landing page: name, email, world choice, new-world checkbox */
const ccMain = document.getElementById('form');
if (ccMain) ccMain.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email');
  const t = document.getElementById('thanks');
  if (!ccValidEmail(email.value)) { t.textContent = 'Please check your email address.'; email.focus(); return; }
  const newWorld = document.getElementById('newworld');
  ccSubscribe(document.getElementById('world').value, email.value,
              document.getElementById('name').value,
              newWorld && newWorld.checked ? { new_world_alerts: 'yes' } : {})
    .then(r => ccMessage(t, r));
});
