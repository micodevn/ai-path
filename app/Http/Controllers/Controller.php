<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\Attempt;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function submit(Request $request)
    {

        try {
            DB::beginTransaction();

            $username = $request->input('userName');
            $phone = $request->input('phone');
            $answers = $request->input('answers');

            if (!$username || !$phone || !$answers) {
                throw new \Exception("Error params");
            }

            $user = User::where('phone', $phone)->orWhere('email', $username)->first();

            if (!$user) {
                $user = User::create([
                    'username' => $username,
                    'phone' => $phone,
                ]);
            }

            $rsPrompt1 = $this->prompt1($answers);
            dd($rsPrompt1);
            $rsPrompt2 = $this->prompt2($rsPrompt1, "Ki su","LTV");


            // Lưu attempt
            Attempt::create([
                'user_id' => $user->user_id,
                'result' => $rsPrompt2,
                'history' => json_encode($answers),
            ]);

//            DB::commit();

            return response()->json(['message' => 'Attempt submitted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Submission failed',
                'error' => $e->getMessage()
            ], 500);
        }
        return response()->json(['message' => 'Attempt submitted successfully']);
    }

    private function prompt1($data)
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
        $prompt = $prefix . $data;

        $result = "RS Prompt 1";
        return $prompt;
    }

    private function prompt2($resultPrompt1, $ans11, $ans12)
    {
        $prompt = "Tôi có một kết quả MBTI, tôi muốn bạn Tư vấn sự nghiệp.
                    #KẾT QUẢ MBTI:
                     " . $resultPrompt1 . "
                    #YÊU CẦU TƯ VẤN:
                    - Tôi đang làm kỹ sư lập trình, senior.
                    - Tôi đang phân vân chở thành " . $ans11 . "hay làm " . $ans12 . ". Bạn hãy cho tôi lời khuyên.

                    #YÊU CẦU VỚI KẾT QUẢ
                    - Bạn hãy có lời khuyên lệch hẳn về một hướng (một vị trí công việc)
                    - Bạn KHÔNG được gợi ý thêm làm việc gì.
                    - Bạn KHÔNG đưa ra lời mời hay khuyến nghị để thiết kế mục tiêu sự nghiệp
                    ";
        $result = "RS Prompt 2";
        return $result;
    }
}
