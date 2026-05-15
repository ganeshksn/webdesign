const fs = require('fs');
const lines = fs.readFileSync('features.md', 'utf8').split('\n');

let html = '';
let inCard = false;

function highlight(text) {
  const l = text.toLowerCase();
  if (l.includes('whatsapp') || l.includes('payment gateway') || l.includes('sms') || l.includes('email notification') || l.includes('razorpay') || l.includes('stripe') || l.includes('payu') || l.includes('cashfree') || l.includes('phonepe') || l.includes('paytm') || l.includes('ccavenue') || l.includes('paypal')) {
    return <span class="feature-highlight"> + text +  <span class="mai-star"></span></span>;
  }
  return text;
}

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  if (line.startsWith('## ')) {
    if (inCard) html += '</ul></div>\n';
    html += '<div class="feature-cat-card">\n  <h4 class="cat-title">' + line.substring(3) + '</h4>\n  <ul class="cat-list">\n';
    inCard = true;
  } else if (line.startsWith('### ')) {
    html += '    <li class="cat-sub">' + line.substring(4) + '</li>\n';
  } else if (line.startsWith('* ')) {
    html += '    <li><span class="mai-checkmark-circle-outline"></span> ' + highlight(line.substring(2)) + '</li>\n';
  } else if (line.startsWith('*')) { 
     html += '    <li><span class="mai-checkmark-circle-outline"></span> ' + highlight(line.replace(/^\*\s*/, '')) + '</li>\n';
  } else if (line.startsWith('- ')) {
    html += '    <li><span class="mai-checkmark-circle-outline"></span> ' + highlight(line.substring(2)) + '</li>\n';
  }
}
if (inCard) html += '</ul></div>\n';

const wrapper = 
<!-- Expand Features Button -->
<div class="text-center mt-2 mb-5 wow fadeInUp">
  <button id="btn-expand-features" class="btn btn-outline" style="padding: 1rem 2.5rem; font-size: 1.05rem; border-radius: 50px; background: rgba(255,107,43,0.05); color: #FF6B2B; border-color: rgba(255,107,43,0.3);">
    <span class="mai-layers-outline mr-2"></span> List of features we can implement
  </button>
</div>

<!-- Features Container -->
<div class="features-collapsible" id="features-collapsible" style="display:none; overflow:hidden;">
  <div class="container pb-5">
    <div class="section-header centered mb-5 pt-4">
      <div class="badge-pill mb-3">Comprehensive Capabilities</div>
      <h2 class="display-3">Master <span class="text-primary">Feature List</span></h2>
      <p class="text-secondary text-lg">A structured overview of the integrations and modules we can build.</p>
    </div>
    <div class="features-masonry">
 + html + 
    </div>
  </div>
</div>
;

fs.writeFileSync('features.html', wrapper);
console.log('HTML generated.');
