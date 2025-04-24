window.contentLoaded = false;

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

    window.exportPDF = async () => {
        if (!window.contentLoaded) {
            return;
        }
        
        const element = document.getElementById("content-to-print");
        element.classList.toggle('print-mode', true);
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
            element.classList.toggle('print-mode', false);
        });
    };

    const renderDataToDOM = (data) => {
        const result = data.attempt.result;
        const userName = data.user.name;
        const resultPromptFirst = data.attempt.result_prompt1;
        const answer = JSON.parse(data.attempt.answers);
        const currentJob = answer[10].answer[0];
        const nextJobs = answer[11].answer.join(", ");
        let htmlContentFirst = resultPromptFirst;
        let htmlContentSecond = result;
        const textBadge = document.getElementById("result-content-body-badge");
        if (validateText(resultPromptFirst)) {
            textBadge.innerHTML = validateText(resultPromptFirst);
        }
        console.log(htmlContentFirst, htmlContentSecond);

        if (typeof showdown !== "undefined") {
            const converter = new showdown.Converter();

            htmlContentFirst = converter.makeHtml(htmlContentFirst);
            htmlContentSecond = converter.makeHtml(htmlContentSecond);
        }

        document.getElementById("user-name-span").innerHTML = DOMPurify.sanitize(userName);
        document.getElementById("result-promt-first").innerHTML = DOMPurify.sanitize(htmlContentFirst);
        document.getElementById("result-promt-second").innerHTML = DOMPurify.sanitize(htmlContentSecond);
        document.getElementById("result-current-job").innerHTML = DOMPurify.sanitize(currentJob);
        document.getElementById("result-content-body-job").innerHTML = DOMPurify.sanitize(nextJobs);
    };

    const getDataApi = async () => {
        try {
            const res = await fetch(`/api/result?attemptId=${attemptId}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            const data = await res.json();
            renderDataToDOM(data);

            const buttonDownloadPdf = document.querySelector(".result-content-btn-download");
            window.contentLoaded = true;
            buttonDownloadPdf.addEventListener("click", () => exportPDF());
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    getDataApi();
});
