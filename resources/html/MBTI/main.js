document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById('button-submit');
  const questions = document.querySelectorAll('.question');
  const validateTextArr = [
    "thất nghiệp",
    "ở nhà",
    "ở không",
    "lang thang",
    "tự do",
    "ăn bám",
    "vô công rồi nghề",
    "vô nghề",
    "chưa làm gì",
    "nghỉ việc",
    "tạm nghỉ",
    "chờ việc",
    "rảnh rỗi",
    "làm chơi chơi",
    "làm linh tinh",
    "đang tìm việc",
    "làm việc không tên",
    "tự do kiếm sống",
    "không nghề nghiệp",
    "làm cho vui",
    "nghỉ hưu",
    "ở ẩn",
    "không xác định",
    "không rõ",
    "không có",
    "không muốn nói",
    "giấu nghề",
    "bí mật",
    "việc vặt",
    "freelancer linh tinh",
    "chờ thời",
    "ăn chơi",
    "nghỉ ngơi",
    "đang nghỉ",
    "ở trọ",
    "sinh viên thất nghiệp",
    "lười biếng",
    "chưa có định hướng",
    "đang phân vân",
    "sống qua ngày",
    "chưa có nghề",
    "đang tính",
    "đang cân nhắc",
    "chờ duyên",
    "ngẫu nhiên",
    "không ổn định",
    "chưa rõ ràng",
    "vẫn đang tìm hiểu",
    "nghỉ dài hạn",
    "lang bang",
    "vãng lai",
    "đang lông bông",
    "nghỉ dưỡng",
    "đang lười",
    "làm gì cũng được",
    "không quan tâm",
    "tùy hứng",
    "không xác minh",
    "khó nói",
    "vui là chính"
  ]

  function containsInvalidAnswer(text) {
    return validateTextArr.some(item => text.toLowerCase().includes(item));
  }

  async function submitForm(finalAnswer) {
    try {
      const res = await fetch('http://ai-path.test:8080/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'taibv',
          phone: '1998',
          submitData: finalAnswer
        })
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  }

  // Tất cả input radio từ câu 1-10
  const radioQuestions = document.querySelectorAll(".question");
  const radioInputs = document.querySelectorAll('input[type="radio"]');

  // Các ô input dạng text (câu 11, 12)
  const textInputs = document.querySelectorAll('.write-answer');

  // Kiểm tra trạng thái trả lời đủ
  function checkIfAllAnswered() {
    let radioAnswered = Array.from(radioQuestions).every(q => {
      const name = q.querySelector('input')?.name;
      return !!document.querySelector(`input[name="${name}"]:checked`);
    });

    let textAnswered = Array.from(textInputs).every(input => {
      const value = input.value.trim();
      const isValid = value !== '' && !containsInvalidAnswer(value);

      const errorEl = input.parentNode.querySelector('.error-message');
      if (containsInvalidAnswer(value)) {
        input.classList.add('is-invalid');
        if (errorEl) errorEl.style.display = 'block';
      } else {
        input.classList.remove('is-invalid');
        if (errorEl) errorEl.style.display = 'none';
      }

      return isValid;
    });

    submitBtn.disabled = !(radioAnswered && textAnswered);
  }

  // Gắn listener
  textInputs.forEach(input => {
    input.insertAdjacentHTML('afterend', `
    <div class="error-message" style="color: red; font-size: 14px; margin-top: 4px; display: none;">
      Vui lòng chọn mục tiêu nghề nghiệp hoặc công việc thật chuyên nghiệp.
    </div>
  `);

    input.addEventListener('input', () => {
      checkIfAllAnswered();
    });
  });

  // Gán sự kiện khi chọn radio
  radioInputs.forEach(input => {
    input.addEventListener('change', checkIfAllAnswered);
  });

  // Gán sự kiện khi nhập text
  textInputs.forEach(input => {
    input.addEventListener('input', checkIfAllAnswered);
  });

  // Ban đầu disable nút submit
  checkIfAllAnswered();

  submitBtn.addEventListener('click', async function (e) {
    console.log('Button clicked!');
    const results = [];

    questions.forEach((questionDiv) => {
      const title = questionDiv.querySelector('.question-title')?.innerText.trim();
      const selectedInput = questionDiv.querySelector('input[type="radio"]:checked');
      let formCheckLabel = questionDiv.querySelectorAll('.form-check-label');
      formCheckLabel = Array.from(formCheckLabel).map(label => label.innerText.trim());
      const answer = selectedInput ? selectedInput.value : null;

      formCheckLabel.forEach((label, index) => {
        if (label === answer) {
          formCheckLabel[index] = `${label} [selected]`;
        }
      });

      results.push({
        question: title,
        answer: formCheckLabel,
      });

    });

    const textInput = document.querySelectorAll('.write-answer');
    textInput.forEach((input, index) => {
      const answer = input.value.trim();
      let defaultTitle = '11. Hãy mô tả ngắn gọn về điểm mạnh của bạn.';
      if (index == 2) {
        results[11].answer = [...results[11].answer, answer];
        return;
      }
      if (index == 1 || index == 2) {
        defaultTitle = '12. Nêu 2 lựa chọn mục tiêu sự nghiệp dài hạn của bạn.';

      }
      results.push({
        question: defaultTitle,
        answer: [answer],
      });
    });
    await submitForm(results);
  });
});
