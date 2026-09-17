const documentTypes = {
  "written-warning": {
    title: "تنبيه خطي",
    formTitle: "إنشاء تنبيه خطي",
    reasonLabel: "سبب التنبيه الخطي",
    signature: "لجنة الانضباط",
    personType: "student",
    intro: (name, grade, section) =>
      `بناءً على متابعة السلوك والانضباط المدرسي، تقرر توجيه تنبيه خطي إلى الطالب/ة <strong>${escapeHtml(name)}</strong> من الصف <strong>${escapeHtml(grade)}</strong>، الشعبة <strong>${escapeHtml(section)}</strong>.`,
    closing:
      "يرجى الالتزام بأنظمة المدرسة وتعليماتها، وتجنب تكرار السبب المذكور أدناه، حرصًا على انتظام العملية التعليمية والسلوك المدرسي."
  },

  "oral-warning": {
    title: "إنذار كتابي",
    formTitle: "إنشاء إنذار كتابي",
    reasonLabel: "سبب الإنذار الكتابي",
    signature: "لجنة الانضباط",
    personType: "student",
    intro: (name, grade, section) =>
      `تم توجيه إنذار كتابي للطالب/ة <strong>${escapeHtml(name)}</strong> من الصف <strong>${escapeHtml(grade)}</strong>، الشعبة <strong>${escapeHtml(section)}</strong>، وذلك بعد متابعة الحالة السلوكية للطالب/ة.`,
    closing:
      "يُعد هذا الإنذار إجراءً انضباطيًا كتابيًا، ويُرجى الالتزام بأنظمة المدرسة وتعليماتها وعدم تكرار المخالفة."
  },

  "parent-call": {
    title: "استدعاء ولي أمر",
    formTitle: "إنشاء استدعاء ولي أمر",
    reasonLabel: "سبب استدعاء ولي الأمر",
    signature: "",
    personType: "guardian",
    intro: (guardianName, grade, section) =>
      `السيد/ة <strong>${escapeHtml(guardianName)}</strong> المحترم/ة، نرجو منكم مراجعة المدرسة بخصوص الطالب/ة في الصف <strong>${escapeHtml(grade)}</strong>، الشعبة <strong>${escapeHtml(section)}</strong>.`,
    closing:
      "نرجو التكرم بالحضور إلى المدرسة ومراجعة التوجيه لمناقشة الموضوع واتخاذ ما يلزم بالتعاون معكم."
  },

  "temporary-dismissal": {
    title: "قرار فصل مؤقت",
    formTitle: "إنشاء قرار فصل مؤقت",
    reasonLabel: "سبب الفصل المؤقت",
    signature: "لجنة الانضباط",
    personType: "student",
    intro: (name, grade, section) =>
      `بناءً على متابعة الحالة السلوكية والانضباطية، تقرر فصل الطالب/ة <strong>${escapeHtml(name)}</strong> من الصف <strong>${escapeHtml(grade)}</strong>، الشعبة <strong>${escapeHtml(section)}</strong> فصلًا مؤقتًا.`,
    closing:
      "يأتي هذا الإجراء وفق الأنظمة الانضباطية المعتمدة في المدرسة، وعلى الطالب/ة الالتزام بالتعليمات المدرسية عند العودة."
  },

  "permanent-dismissal": {
    title: "قرار فصل دائم",
    formTitle: "إنشاء قرار فصل دائم",
    reasonLabel: "سبب الفصل الدائم",
    signature: "لجنة الانضباط",
    personType: "student",
    intro: (name, grade, section) =>
      `بناءً على متابعة الحالة السلوكية والانضباطية، تقرر فصل الطالب/ة <strong>${escapeHtml(name)}</strong> من الصف <strong>${escapeHtml(grade)}</strong>، الشعبة <strong>${escapeHtml(section)}</strong> فصلًا دائمًا.`,
    closing:
      "تم إصدار هذا القرار وفق الأنظمة والإجراءات الانضباطية المعتمدة في المدرسة."
  }
};

let currentType = null;

const homeView = document.getElementById("homeView");
const editorView = document.getElementById("editorView");
const formTitle = document.getElementById("formTitle");
const reasonLabel = document.getElementById("reasonLabel");

const studentNameGroup = document.getElementById("studentNameGroup");
const guardianNameGroup = document.getElementById("guardianNameGroup");
const floorGroup = document.getElementById("floorGroup");

const studentName = document.getElementById("studentName");
const guardianName = document.getElementById("guardianName");
const grade = document.getElementById("grade");
const section = document.getElementById("section");
const reason = document.getElementById("reason");
const documentDate = document.getElementById("documentDate");
const floor = document.getElementById("floor");

const pdfTitle = document.getElementById("pdfTitle");
const pdfBody = document.getElementById("pdfBody");
const pdfDate = document.getElementById("pdfDate");
const pdfSignature = document.getElementById("pdfSignature");
const pdfDocument = document.getElementById("pdfDocument");

setToday();

document.querySelectorAll(".action-card").forEach(button => {
  button.addEventListener("click", () => {
    const externalUrl = button.dataset.url;

    if (externalUrl) {
      window.location.href = externalUrl;
      return;
    }

    openDocument(button.dataset.type);
  });
});

document.getElementById("backBtn").addEventListener("click", goHome);
document.getElementById("updatePreviewBtn").addEventListener("click", updatePreview);
document.getElementById("clearBtn").addEventListener("click", clearForm);
document.getElementById("pdfBtn").addEventListener("click", exportPDF);
document.getElementById("printBtn").addEventListener("click", () => {
  updatePreview();
  window.print();
});

[
  studentName,
  guardianName,
  grade,
  section,
  reason,
  documentDate,
  floor
].forEach(field => {
  field.addEventListener("input", updatePreview);
  field.addEventListener("change", updatePreview);
});

function openDocument(type) {
  currentType = type;
  const config = documentTypes[type];

  formTitle.textContent = config.formTitle;
  reasonLabel.textContent = config.reasonLabel;

  const isGuardian = config.personType === "guardian";

  studentNameGroup.classList.toggle("hidden", isGuardian);
  guardianNameGroup.classList.toggle("hidden", !isGuardian);
  floorGroup.classList.toggle("hidden", type !== "parent-call");

  studentName.required = !isGuardian;
  guardianName.required = isGuardian;
  floor.required = type === "parent-call";

  homeView.classList.remove("active");
  editorView.classList.add("active");

  clearForm(false);
  updatePreview();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  editorView.classList.remove("active");
  homeView.classList.add("active");
  currentType = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearForm(resetDate = true) {
  studentName.value = "";
  guardianName.value = "";
  grade.value = "";
  section.value = "";
  reason.value = "";
  floor.value = "";

  if (resetDate || !documentDate.value) {
    setToday();
  }

  updatePreview();
}

function updatePreview() {
  if (!currentType) return;

  const config = documentTypes[currentType];

  const personName =
    config.personType === "guardian"
      ? (guardianName.value.trim() || "........................")
      : (studentName.value.trim() || "........................");

  const gradeValue = grade.value.trim() || "........";
  const sectionValue = section.value.trim() || "........";
  const reasonValue = reason.value.trim() || "................................................................";

  pdfTitle.textContent = config.title;

  pdfBody.innerHTML = `
    <p>${config.intro(personName, gradeValue, sectionValue)}</p>

    <table class="document-data">
      <tr>
        <td>${config.personType === "guardian" ? "اسم ولي الأمر" : "اسم الطالب / الطالبة"}</td>
        <td>${escapeHtml(personName)}</td>
      </tr>
      <tr>
        <td>الصف</td>
        <td>${escapeHtml(gradeValue)}</td>
      </tr>
      <tr>
        <td>الشعبة</td>
        <td>${escapeHtml(sectionValue)}</td>
      </tr>
    </table>

    <p><strong>${escapeHtml(config.reasonLabel)}:</strong></p>
    <div class="reason-box">${formatMultiline(reasonValue)}</div>

    <p style="margin-top: 24px;">${config.closing}</p>
  `;

  pdfDate.textContent = formatDate(documentDate.value);

  if (currentType === "parent-call") {
    pdfSignature.textContent = floor.value
      ? `توجيه الطابق – ${floor.value}`
      : "توجيه الطابق – ................";
  } else {
    pdfSignature.textContent = config.signature;
  }
}

function validateCurrentForm() {
  if (!currentType) return false;

  const config = documentTypes[currentType];

  if (config.personType === "student" && !studentName.value.trim()) {
    alert("يرجى كتابة اسم الطالب / الطالبة.");
    studentName.focus();
    return false;
  }

  if (config.personType === "guardian" && !guardianName.value.trim()) {
    alert("يرجى كتابة اسم ولي أمر الطالب.");
    guardianName.focus();
    return false;
  }

  if (!grade.value.trim()) {
    alert("يرجى كتابة الصف.");
    grade.focus();
    return false;
  }

  if (!section.value.trim()) {
    alert("يرجى كتابة الشعبة.");
    section.focus();
    return false;
  }

  if (!reason.value.trim()) {
    alert("يرجى كتابة السبب.");
    reason.focus();
    return false;
  }

  if (!documentDate.value) {
    alert("يرجى اختيار التاريخ.");
    documentDate.focus();
    return false;
  }

  if (currentType === "parent-call" && !floor.value) {
    alert("يرجى اختيار الطابق.");
    floor.focus();
    return false;
  }

  return true;
}

async function exportPDF() {
  if (!validateCurrentForm()) return;

  updatePreview();

  if (typeof html2pdf === "undefined") {
    alert("تعذر تحميل أداة PDF. تحقق من اتصال الإنترنت أو استخدم زر «طباعة / حفظ PDF».");
    return;
  }

  const config = documentTypes[currentType];
  const rawName =
    config.personType === "guardian"
      ? guardianName.value.trim()
      : studentName.value.trim();

  const safeName = rawName.replace(/[\\/:*?"<>|]/g, "-");
  const filename = `${config.title} - ${safeName}.pdf`;

  const options = {
    margin: 0,
    filename,
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 1.8,
      useCORS: false,
      allowTaint: false,
      letterRendering: true,
      backgroundColor: "#ffffff",
      logging: false
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"]
    }
  };

  const originalShadow = pdfDocument.style.boxShadow;
  pdfDocument.style.boxShadow = "none";

  const pdfButton = document.getElementById("pdfBtn");
  const originalButtonText = pdfButton.textContent;
  pdfButton.disabled = true;
  pdfButton.textContent = "جارٍ إنشاء PDF...";

  try {
    await waitForImages(pdfDocument);

    await html2pdf()
      .set(options)
      .from(pdfDocument)
      .save();

  } catch (error) {
    console.error("PDF export error:", error);
    alert(
      "تعذر إنشاء ملف PDF تلقائيًا.\n\n" +
      "جرّب أولًا إعادة فتح الصفحة ثم التصدير مرة أخرى.\n" +
      "ويمكنك دائمًا استخدام زر «طباعة / حفظ PDF» واختيار Save as PDF."
    );
  } finally {
    pdfDocument.style.boxShadow = originalShadow;
    pdfButton.disabled = false;
    pdfButton.textContent = originalButtonText;
  }
}

function waitForImages(container) {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    })
  );
}

function setToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  documentDate.value = `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";

  const [year, month, day] = value.split("-");
  return `${day} / ${month} / ${year}`;
}

function formatMultiline(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
