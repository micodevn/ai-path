<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Attempt;
use App\Services\ILLMModel;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected ILLMModel $llm;

    public function __construct(ILLMModel $llm)
    {
        $this->llm = $llm;
    }

    public function submit(Request $request)
    {

        try {
            DB::beginTransaction();

            $userIdAttempt = $request->input('userId');
            $email = $request->input('email');
            $name = $request->input('name');
            $answers = $request->input('submitData');

//            if (!$userIdAttempt) {
//                throw new \Exception("Error userId");
//            }

//            $user = User::where('user_id_attempt', $userIdAttempt)->first();

//            if (!$user) {
//                $user = User::create([
//                    'user_id_attempt' => $userIdAttempt,
//                    'email' => $email,
//                    'name' => $name,
//                ]);
//            }

            $rsPrompt1 = $this->prompt1($answers);

            $answerQ11 = $answers[10]['answer'][0] ?? "";
            $answerQ12 = $answers[11]['answer'] ?? [];

            $rsPrompt2 = $this->prompt2($rsPrompt1, $answerQ11, $answerQ12);

            // Lưu attempt
            $attempt = Attempt::create([
                'user_id_attempt' => $userIdAttempt ?? null,
                'email' => $email ?? null,
                'name' => $name ?? null,
                'result' => $rsPrompt2,
                'result_prompt1' => $rsPrompt1,
                'answers' => json_encode($answers),
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Attempt submitted successfully', 'attempt' => $attempt]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Submission failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function prompt1($answers)
    {
        $prefix = 'Tôi đã làm 01 quiz MBIT rút gọn. Bạn hãy chấm cho tôi
Yêu cầu với công việc của bạn:
#Cấu trúc: gồm 3 phần, Kết quả, Phân tích Kết quả và Tóm tắt MBTI
#Phần Kết quả: bạn xác nhận kết quả thật ngắn gọn
#Phần Phân tích kết quả: bạn hãy phân tích kết quả chấm được
#Phần Tóm tắt MBTI: bạn hãy tóm tắt kết quả ngắn gọn trong vài câu
#Bạn hãy đánh số các phần output theo số thứ tự (ordered list)
#Bạn KHÔNG đưa thêm comment gì.
#Bạn KHÔNG gợi ý thêm gì về Tư vấn sự nghiệp hoặc thêm bất cứ nội dùng gì khác
#Kết quả làm Quiz MBIT của tôi là:
';

        $answersConvert = '';


        foreach ($answers as $q) {
            $answersConvert .= $q['question'] . PHP_EOL;
            foreach ($q['answer'] as $answer) {
                $answersConvert .= $answer . PHP_EOL;
            }
            $answersConvert .= PHP_EOL; // ngăn cách giữa các câu hỏi
        }


        $prompt = $prefix . $answersConvert;


        $result = $this->llm->ask($prompt);
        return $result;
    }

    private function prompt2($resultPrompt1, $ans11, $ans12)
    {
        $prompt = "Tôi có một kết quả MBTI, tôi muốn bạn Tư vấn sự nghiệp.
#KẾT QUẢ MBTI:
 " . $resultPrompt1 . "
#YÊU CẦU TƯ VẤN:
- Tôi đang làm " . $ans11 . ".
- Tôi đang phân vân chở thành " . $ans12[0] . " hay làm " . $ans12[1] . ". Bạn hãy cho tôi lời khuyên.

#YÊU CẦU VỚI KẾT QUẢ
- Bạn hãy có lời khuyên lệch hẳn về một hướng (một vị trí công việc)
- Bạn KHÔNG được gợi ý thêm làm việc gì.
- Bạn KHÔNG đưa ra lời mời hay khuyến nghị để thiết kế mục tiêu sự nghiệp
";

        $result = $this->llm->ask($prompt);
        return $result;
    }


    public function result(Request $request)
    {
        $attemptId = $request->attemptId;
        if (!$attemptId) {
            throw new \Exception("Attempt is invalid !");
        }

        $resultAttempt = Attempt::where("id", $attemptId)->first();
//        $userId = $resultAttempt->user_id_attempt;
//        $user = User::where("user_id_attempt", $userId)->first();

        return response()->json(['success' => true, 'message' => 'success', 'attempt' => $resultAttempt]);

    }
}
