const htmlEditor = ace.edit("htmlEditor");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setValue("<h1>Hello World...!</h1>");
htmlEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const cssEditor = ace.edit("cssEditor");
cssEditor.session.setMode("ace/mode/css");
cssEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const jsEditor = ace.edit("jsEditor");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.setValue("console.log('Hello from JS');");
jsEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const outputFrame = document.getElementById("outputFrame");
let isDark = false;

function updateOutput() {
  const htmlCode = htmlEditor.getValue();

  // Inject dark/light mode style for iframe body
  const cssCode =
    `<style>
        body {
          color: ${isDark ? "white" : "black"};
          background-color: ${isDark ? "#1e1e1e" : "white"};
        }
      </style>` +
    "<style>" +
    cssEditor.getValue() +
    "</style>";

  const jsCode = "<script>" + jsEditor.getValue() + "</script>";

  outputFrame.srcdoc = htmlCode + cssCode + jsCode;
}

// Live update whenever editor content changes
htmlEditor.session.on("change", updateOutput);
cssEditor.session.on("change", updateOutput);
jsEditor.session.on("change", updateOutput);

// Run once on load
updateOutput();

// ================================
// Copy & Clear Functions
// ================================
function copyHtmlCode() {
  navigator.clipboard.writeText(htmlEditor.getValue());
  alert("HTML code copied!");
}
function copyCssCode() {
  navigator.clipboard.writeText(cssEditor.getValue());
  alert("CSS code copied!");
}
function copyJsCode() {
  navigator.clipboard.writeText(jsEditor.getValue());
  alert("JS code copied!");
}
function clearHtmlCode() {
  htmlEditor.setValue("");
}
function clearCssCode() {
  cssEditor.setValue("");
}
function clearJsCode() {
  jsEditor.setValue("");
}

// ================================
// Theme Toggle
// ================================
const theme = document.getElementById("theme");
const pdf = document.getElementById("pdf");
const about = document.getElementById("about");

theme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  isDark = !isDark;

  // Switch Ace editor themes
  if (isDark) {
    htmlEditor.setTheme("ace/theme/chaos");
    cssEditor.setTheme("ace/theme/chaos");
    jsEditor.setTheme("ace/theme/chaos");
  } else {
    htmlEditor.setTheme("ace/theme/chrome");
    cssEditor.setTheme("ace/theme/chrome");
    jsEditor.setTheme("ace/theme/chrome");
  }

  // Change icons + parent styles
  theme.src = isDark ? "/images/lightmode.png" : "/images/darkmode.png";
  pdf.src = isDark ? "/images/lightmodepdf.png" : "/images/pdf.png";
  about.src = isDark ? "/images/lightabout.png" : "/images/about.png";

  document.body.style.color = isDark ? "white" : "black";
  document.body.style.backgroundColor = isDark ? "#1e1e1e" : "white";

  // 🔥 Re-render iframe with correct theme
  updateOutput();
});
// =================== ABOUT MODAL =================== //
const aboutIcon = document.getElementById("about");
const aboutModal = document.getElementById("aboutModal");
const closeBtn = aboutModal.querySelector(".close");

aboutIcon.addEventListener("click", () => {
  aboutModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  aboutModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === aboutModal) {
    aboutModal.style.display = "none";
  }
});
const pdfIcon = document.getElementById("pdf");

pdfIcon.addEventListener("click", () => {
  function downloadPdf() {
    const { jsPDF } = window.jspdf;
    confirm("Download code");

    // Get code from editors
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    // Create PDF
    const doc = new jsPDF();
    let y = 20; // starting y-coordinate

    // Title
    doc.setFont("courier", "normal");
    doc.setFontSize(14);
    doc.text("QuickCode Project Export", 10, 10);
    doc.setFontSize(10);

    // Helper to add code block with automatic new page if needed
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

      // Add separator line
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

    // Add blocks on separate pages
    addCodeBlock("HTML Code:", htmlCode);
    doc.addPage();
    y = 20; // ensure new page for CSS

    addCodeBlock("CSS Code:", cssCode);
    doc.addPage();
    y = 20; // ensure new page for JS

    addCodeBlock("JavaScript Code:", jsCode);

    // Save PDF
    doc.save("code.pdf");
  }

  downloadPdf(); // call the function
});
