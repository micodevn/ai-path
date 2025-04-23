document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const attemptId = params.get("attemptId");

  const validateText = (text) => {
    const mbtiTypes = [
      "INTJ", "INTP", "ENTJ", "ENTP",
      "INFJ", "INFP", "ENFJ", "ENFP",
      "ISTJ", "ISFJ", "ESTJ", "ESFJ",
      "ISTP", "ISFP", "ESTP", "ESFP"
    ];
    return mbtiTypes.find(item => text.includes(item));
  }

  const renderDataToDOM = (data) => {


    const result = data.attempt.result;
    const userName = data.user.name;
    const resultPromptFirst = data.attempt.result_prompt1;
    const answer = JSON.parse(data.attempt.answers);
    const currentJob = answer[10].answer[0];
    const nextJobs = answer[11].answer.join(", ");
    const htmlContentFirst = resultPromptFirst.replace(/\n/g, "<br>");
    const htmlContentSecond = result.replace(/\n/g, "<br>");
    const textBadge = document.getElementById("result-content-body-badge");
    if (validateText(resultPromptFirst)) {
      textBadge.innerHTML = validateText(resultPromptFirst);
    }
    document.getElementById("user-name-span").innerHTML = DOMPurify.sanitize(userName);
    document.getElementById("result-promt-first").innerHTML = DOMPurify.sanitize(htmlContentFirst);
    document.getElementById("result-promt-second").innerHTML = DOMPurify.sanitize(htmlContentSecond);
    document.getElementById("result-current-job").innerHTML = DOMPurify.sanitize(currentJob);
    document.getElementById("result-content-body-job").innerHTML = DOMPurify.sanitize(nextJobs);
  };

  const exportPDF = async () => {
    const element = document.getElementById("content-to-print");
    element.style.backgroundImage = "url('background.png')";

    html2canvas(element, {
      backgroundColor: null,
      useCORS: true,              // Cho phép lấy ảnh từ CDN nếu có
      scale: 2                    // Chất lượng cao hơn
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Tạo link download ảnh
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "ket-qua.png";
      link.click();
      element.style.backgroundImage = "";
    });
    // const element = document.getElementById("content-to-print");
    // element.classList.add("print-mode");

    // setTimeout(async () => {
    //   const canvas = await html2canvas(element, {
    //     scale: 1,
    //     useCORS: true,
    //   });

    //   const { jsPDF } = window.jspdf;
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();

    //   const imgWidth = pdfWidth;
    //   const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    //   // Tính toán độ cao trang PDF
    //   const canvasPageHeight = Math.floor(pdfHeight * (canvas.width / pdfWidth));
    //   console.log(canvasPageHeight);

    //   let position = 0;
    //   let page = 0;

    //   while (position < canvas.height) {
    //     const pageCanvas = document.createElement("canvas");
    //     pageCanvas.width = canvas.width;
    //     pageCanvas.height = Math.min(canvasPageHeight, canvas.height - position);

    //     const pageCtx = pageCanvas.getContext("2d");
    //     pageCtx.drawImage(
    //       canvas,
    //       0,
    //       position,
    //       canvas.width,
    //       pageCanvas.height,
    //       0,
    //       0,
    //       canvas.width,
    //       pageCanvas.height
    //     );

    //     const imgData = pageCanvas.toDataURL("image/png");
    //     if (page > 0) pdf.addPage();
    //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, (pageCanvas.height * imgWidth) / canvas.width);

    //     position += canvasPageHeight;
    //     page++;
    //   }

    //   // Điều chỉnh khoảng cách và padding của trang PDF
    //   pdf.save("ket-qua.pdf");
    //   element.classList.remove("print-mode");
    // }, 300);
  };

  const getDataApi = async () => {
    try {
      const res = await fetch(`/api/result?attemptId=${attemptId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      renderDataToDOM(data);

      const buttonDownloadPdf = document.querySelector(".result-content-btn-download");
      buttonDownloadPdf.addEventListener("click", () => exportPDF());
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  getDataApi();
});
