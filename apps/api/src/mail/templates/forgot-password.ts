export function forgotPasswordEmail(resetUrl: string) {
  const href = escapeHtml(resetUrl)
  return {
    subject: 'Reset your password / စကားဝှက် ပြန်သတ်မှတ်ပါ',
    html: `<!doctype html>
<html lang="en">
  <body>
    <p>Reset your SoftGate Comic password. This link expires in one hour.</p>
    <p><a href="${href}">${href}</a></p>
    <p>If you did not ask for this, you can ignore this email.</p>
    <hr />
    <p lang="my">SoftGate Comic စကားဝှက် ပြန်သတ်မှတ်ရန်။ ဤလင့်ခ်သည် တစ်နာရီအတွင်း သက်တမ်းကုန်ပါသည်။</p>
    <p lang="my"><a href="${href}">${href}</a></p>
    <p lang="my">သင်မတောင်းထားပါက ဤအီးမေးလ်ကို လျစ်လျူရှုနိုင်ပါသည်။</p>
  </body>
</html>`,
    text: `Reset your SoftGate Comic password. This link expires in one hour.\n${resetUrl}\n\nIf you did not ask for this, you can ignore this email.\n\nSoftGate Comic စကားဝှက် ပြန်သတ်မှတ်ရန်။ ဤလင့်ခ်သည် တစ်နာရီအတွင်း သက်တမ်းကုန်ပါသည်။\n${resetUrl}\n\nသင်မတောင်းထားပါက ဤအီးမေးလ်ကို လျစ်လျူရှုနိုင်ပါသည်။`,
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}
