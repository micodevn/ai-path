<?php

namespace App\Console\Commands;

use App\Services\ILLMModel;
use Illuminate\Console\Command;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(ILLMModel $model)
    {
        dd($model->ask('Tôi đã làm 01 quiz MBIT rút gọn. Bạn hãy chấm cho tôi
Yêu cầu với công việc của bạn:
#Cấu trúc: gồm 3 phần, Kết quả, Phân tích Kết quả và Tóm tắt MBTI
#Phần Kết quả: bạn xác nhận kết quả thật ngắn gọn
#Phần Phân tích kết quả: bạn hãy phân tích kết quả chấm được
#Phần Tóm tắt MBTI: bạn hãy tóm tắt kết quả ngắn gọn trong vài câu
#Bạn hãy đánh số các phần output theo số thứ tự (ordered list)
#Bạn KHÔNG đưa thêm comment gì.
#Bạn KHÔNG gợi ý thêm gì về Tư vấn sự nghiệp hoặc thêm bất cứ nội dùng gì khác
#Kết quả làm Quiz MBIT của tôi là:
1. Bạn cảm thấy năng lượng đến từ đâu?
a) Từ việc giao tiếp và tương tác với mọi người.
b) Từ thời gian một mình, suy nghĩ sâu về những gì đang xảy ra. [selected]

2. Bạn thường ưu tiên điều gì khi ra quyết định?
a) Lý trí, phân tích các yếu tố khách quan.
b) Cảm xúc và cách nó ảnh hưởng đến mọi người xung quanh. [selected]

3. Bạn thích làm gì hơn trong công việc hoặc học tập?
a) Làm theo một kế hoạch rõ ràng và có sự tổ chức. [selected]
b) Linh hoạt, thích khám phá và làm việc theo cách của riêng mình.

4. Khi gặp một vấn đề mới, bạn thường làm gì?
a) Tập trung vào các chi tiết cụ thể, làm theo hướng dẫn đã có. [selected]
b) Dành thời gian suy nghĩ về các khả năng và cách giải quyết khác nhau.

5. Bạn cảm thấy thoải mái hơn trong tình huống nào?
a) Thích ở những nơi có người khác, năng động, nói chuyện nhiều. [selected]
b) Thích ở một mình hoặc trong nhóm nhỏ, yên tĩnh.

6. Khi phải hoàn thành một công việc, bạn sẽ làm gì trước?
a) Lập kế hoạch và bắt tay vào làm ngay. [selected]
b) Chờ đợi, tìm thêm thông tin và tùy cơ ứng biến.

7. Bạn thích kiểu công việc nào hơn?
a) Công việc cụ thể, rõ ràng với các yêu cầu chi tiết. [selected]
b) Công việc đòi hỏi sự sáng tạo và có không gian để thử nghiệm.

8. Bạn có xu hướng chọn lựa công việc, học tập dựa trên gì?
a) Các yếu tố thực tế, có thể đo lường và phân tích.
b) Những cơ hội mới, những khía cạnh thú vị hoặc sáng tạo. [selected]

9. Bạn cảm thấy sao về các kế hoạch và lịch trình?
a) Thích có kế hoạch rõ ràng, tuân thủ các quy định.
b) Thích linh hoạt, đôi khi không theo kế hoạch cụ thể. [selected]

10. Bạn cảm thấy như thế nào về những tình huống xã hội?
a) Thích tham gia vào các cuộc trò chuyện và hoạt động xã hội.
b) Thích quan sát và tham gia khi cảm thấy cần thiết, nhưng không quá năng động. [selected]
11. Bạn đang làm công việc gì ?
Sếp tổng

12. Nêu 2 lựa chọn mục tiêu công việc dài hạn của bạn:
Giám đốc
Mẹ
'));
    }
}
