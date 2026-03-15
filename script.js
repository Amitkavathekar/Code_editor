// Default Ace Editor setup for Signup Page

const htmlEditor = ace.edit('htmlEditor');
htmlEditor.session.setMode('ace/mode/html');
htmlEditor.setValue(
`<div class="signup-container">
  <h2>Sign Up</h2>
  <form id="signupForm" onsubmit="signup(event)">
    <input type="text" id="name" placeholder="Name" required /><br />
    <input type="email" id="email" placeholder="Email" required /><br />
    <input type="password" id="password" placeholder="Password" required /><br />
    <button type="submit">Register</button>
  </form>
  <div id="signupMessage"></div>
</div>`
);
htmlEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const cssEditor = ace.edit('cssEditor');
cssEditor.session.setMode('ace/mode/css');
cssEditor.setValue(
`.signup-container {
  width: 350px;
  margin: 50px auto;
  padding: 30px 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px #8886;
  background: #fff;
  text-align: center;
}
.signup-container h2 {
  margin-bottom: 15px;
}
.signup-container input {
  width: 90%;
  margin: 7px 0;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #999;
  outline: none;
}
.signup-container button {
  margin-top: 13px;
  width: 95%;
  background-color: #0a72ef;
  color: #fff;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
#signupMessage {
  margin-top: 12px;
  color: green;
  font-size: 15px;
}
body {
  background: #f4f6fa;
  min-height: 100vh;
}`
);
cssEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const jsEditor = ace.edit('jsEditor');
jsEditor.session.setMode('ace/mode/javascript');
jsEditor.setValue(
`function signup(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    document.getElementById('signupMessage').textContent = 'Please fill all fields!';
    document.getElementById('signupMessage').style.color = 'red';
    return;
  }

  // Simple local "success" simulation  
  document.getElementById('signupMessage').textContent = 'Signup successful! Welcome, ' + name + '.';
  document.getElementById('signupMessage').style.color = 'green';
  document.getElementById('signupForm').reset();
}
`
);
jsEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const outputFrame = document.getElementById('outputFrame');
let isDark = false;

function updateOutput() {
  const htmlCode = htmlEditor.getValue();

  const cssCode =
    `<style>
        body {
          color: ${isDark ? 'white' : 'black'};
          background-color: ${isDark ? '#1e1e1e' : 'white'};
        }
      </style>` +
    '<style>' +
    cssEditor.getValue() +
    '</style>';

  // Attach script so signup works in iframe
  const jsCode = `<script>
    ${jsEditor.getValue()}
  <\/script>`;

  outputFrame.srcdoc = htmlCode + cssCode + jsCode;
}

htmlEditor.session.on('change', updateOutput);
cssEditor.session.on('change', updateOutput);
jsEditor.session.on('change', updateOutput);

updateOutput();

function copyHtmlCode() {
  navigator.clipboard.writeText(htmlEditor.getValue());
  alert('HTML code copied!');
}
function copyCssCode() {
  navigator.clipboard.writeText(cssEditor.getValue());
  alert('CSS code copied!');
}
function copyJsCode() {
  navigator.clipboard.writeText(jsEditor.getValue());
  alert('JS code copied!');
}
function clearHtmlCode() {
  htmlEditor.setValue('');
}
function clearCssCode() {
  cssEditor.setValue('');
}
function clearJsCode() {
  jsEditor.setValue('');
}

const theme = document.getElementById('theme');
const pdf = document.getElementById('pdf');
const about = document.getElementById('about');

theme.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  isDark = !isDark;

  // Switch Ace editor themes
  if (isDark) {
    htmlEditor.setTheme('ace/theme/chaos');
    cssEditor.setTheme('ace/theme/chaos');
    jsEditor.setTheme('ace/theme/chaos');
  } else {
    htmlEditor.setTheme('ace/theme/chrome');
    cssEditor.setTheme('ace/theme/chrome');
    jsEditor.setTheme('ace/theme/chrome');
  }

  theme.src = isDark ? '/images/lightmode.png' : '/images/darkmode.png';
  pdf.src = isDark ? '/images/lightmodepdf.png' : '/images/pdf.png';
  about.src = isDark ? '/images/lightabout.png' : '/images/about.png';

  document.body.style.color = isDark ? 'white' : 'black';
  document.body.style.backgroundColor = isDark ? '#1e1e1e' : 'white';

  updateOutput();
});

const aboutIcon = document.getElementById('about');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = aboutModal.querySelector('.close');

aboutIcon.addEventListener('click', () => {
  aboutModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  aboutModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    aboutModal.style.display = 'none';
  }
});
const pdfIcon = document.getElementById('pdf');

pdfIcon.addEventListener('click', () => {
  function downloadPdf() {
    const { jsPDF } = window.jspdf;
    confirm('Download code');

    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    // Create PDF
    const doc = new jsPDF();
    let y = 20;

    doc.setFont('courier', 'normal');
    doc.setFontSize(14);
    doc.text('QuickCode Project Export', 10, 10);
    doc.setFontSize(10);

    function addCodeBlock(title, code) {
      // Add title
      doc.setFontSize(12);
      doc.text(title, 10, y);
      y += 8;

      doc.setFontSize(10);
      const lines = doc.splitTextToSize(code, 180);

      for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
          // page end reached
          doc.addPage();
          y = 20;
        }
        doc.text(lines[i], 10, y);
        y += 6;
      }

      y += 2;
      if (y < 280) {
        doc.setDrawColor(0);
        doc.line(10, y, 200, y);
        y += 10;
      } else {
        doc.addPage();
        y = 20;
      }
    }

    addCodeBlock('HTML Code:', htmlCode);
    doc.addPage();
    y = 20;

    addCodeBlock('CSS Code:', cssCode);
    doc.addPage();
    y = 20;

    addCodeBlock('JavaScript Code:', jsCode);

    // Save PDF
    doc.save('code.pdf');
  }

  downloadPdf();
});
