export function passwordResetEmail() {
  return {
    subject: 'Your password was changed / စကားဝှက် ပြောင်းပြီးပါပြီ',
    html: `<!doctype html>
<html lang="en">
  <body>
    <p>Your SoftGate Comic password was changed. If this was not you, use Forgot password on the site.</p>
    <hr />
    <p lang="my">သင့် SoftGate Comic စကားဝှက်ကို ပြောင်းပြီးပါပြီ။ သင်မလုပ်ပါက ဝက်ဘ်ဆိုက်တွင် Forgot password ကိုသုံးပါ။</p>
  </body>
</html>`,
    text: `Your SoftGate Comic password was changed. If this was not you, use Forgot password on the site.\n\nသင့် SoftGate Comic စကားဝှက်ကို ပြောင်းပြီးပါပြီ။ သင်မလုပ်ပါက ဝက်ဘ်ဆိုက်တွင် Forgot password ကိုသုံးပါ။`,
  }
}
