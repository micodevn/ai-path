document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const name = params.get('name');
  const email = params.get('email');

  const submitBtn = document.getElementById('button-submit');
  const questions = document.querySelectorAll('.question');
  const validateTextArr = [
    "thất nghiệp", "ở nhà", "ở không", "lang thang", "tự do", "ăn bám", "vô công rồi nghề",
    "vô nghề", "chưa làm gì", "nghỉ việc", "tạm nghỉ", "chờ việc", "rảnh rỗi", "làm chơi chơi",
    "làm linh tinh", "đang tìm việc", "làm việc không tên", "tự do kiếm sống", "không nghề nghiệp",
    "làm cho vui", "nghỉ hưu", "ở ẩn", "không xác định", "không rõ", "không có", "không muốn nói",
    "giấu nghề", "bí mật", "việc vặt", "freelancer linh tinh", "chờ thời", "ăn chơi", "nghỉ ngơi",
    "đang nghỉ", "ở trọ", "sinh viên thất nghiệp", "lười biếng", "chưa có định hướng", "đang phân vân",
    "sống qua ngày", "chưa có nghề", "đang tính", "đang cân nhắc", "chờ duyên", "ngẫu nhiên",
    "không ổn định", "chưa rõ ràng", "vẫn đang tìm hiểu", "nghỉ dài hạn", "lang bang", "vãng lai",
    "đang lông bông", "nghỉ dưỡng", "đang lười", "làm gì cũng được", "không quan tâm", "tùy hứng",
    "không xác minh", "khó nói", "vui là chính"
  ];

  const containsInvalidAnswer = (text) =>
    validateTextArr.some(item => text.toLowerCase().includes(item));

  const submitForm = async (finalAnswer) => {
    console.log(finalAnswer);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          name: name,
          email: email,
          submitData: finalAnswer
        })
      });
      const data = await res.json();
      console.log(data);
      const attempt = data.attempt;
      const attemptId = attempt.id;
      window.location.href = `/result?attemptId=${attemptId}`
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const checkIfAllAnswered = () => {
    const radioAnswered = Array.from(questions).every(q => {
      const name = q.querySelector('input')?.name;
      return !!document.querySelector(`input[name="${name}"]:checked`);
    });

    const textAnswered = Array.from(document.querySelectorAll('.write-answer')).every(input => {
      const value = input.value.trim();
      const isValid = value !== '' && !containsInvalidAnswer(value);
      const errorEl = input.parentNode.querySelector('.error-message');

      input.classList.toggle('is-invalid', containsInvalidAnswer(value));
      if (errorEl) errorEl.style.display = containsInvalidAnswer(value) ? 'block' : 'none';

      return isValid;
    });

    submitBtn.disabled = !(radioAnswered && textAnswered);
  };

  const initializeTextInputs = () => {
    document.querySelectorAll('.write-answer').forEach(input => {
      input.insertAdjacentHTML('afterend', `
        <div class="error-message" style="color: red; font-size: 14px; margin-top: 4px; display: none;">
          Vui lòng chọn mục tiêu nghề nghiệp hoặc công việc thật chuyên nghiệp.
        </div>
      `);
      input.addEventListener('input', checkIfAllAnswered);
    });
  };

  const initializeRadioInputs = () => {
    document.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', checkIfAllAnswered);
    });
  };

  const collectResults = () => {
    const results = Array.from(questions).map(questionDiv => {
      const title = questionDiv.querySelector('.question-title')?.innerText.trim();
      const selectedInput = questionDiv.querySelector('input[type="radio"]:checked');
      const formCheckLabels = Array.from(questionDiv.querySelectorAll('.form-check-label'))
        .map(label => label.innerText.trim());

      if (selectedInput) {
        const selectedValue = selectedInput.value;
        formCheckLabels.forEach((label, index) => {
          if (label === selectedValue) formCheckLabels[index] = `${label} [selected]`;
        });
      }

      return { question: title, answer: formCheckLabels };
    });

    document.querySelectorAll('.write-answer').forEach((input, index) => {
      const answer = input.value.trim();
      const defaultTitles = [
        '11. Hãy mô tả ngắn gọn về điểm mạnh của bạn.',
        '12. Nêu 2 lựa chọn mục tiêu sự nghiệp dài hạn của bạn.'
      ];
      if (index == 2) {
        results[11].answer = [...results[11].answer, answer];
        return;
      }
      const title = defaultTitles[index] || `Câu hỏi ${index + 11}`;
      results.push({ question: title, answer: [answer] });
    });

    return results;
  };

  const handleSubmit = async () => {
    console.log('Button clicked!');
    const results = collectResults();
    await submitForm(results);
  };

  // Initialize
  initializeTextInputs();
  initializeRadioInputs();
  checkIfAllAnswered();

  submitBtn.addEventListener('click', handleSubmit);


  //**result */

});
