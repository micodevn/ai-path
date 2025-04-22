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
        dd($model->ask('Tôi có một kết quả MBTI, tôi muốn bạn Tư vấn sự nghiệp.
#KẾT QUẢ MBTI:
 1. **Kết quả:**
   - Kết quả của bài quiz MBTI của bạn là: INFP.

2. **Phân tích Kết quả:**
   - I (Introversion): Bạn có xu hướng lấy lại năng lượng từ thời gian riêng tư và suy ngẫm sâu sắc, cảm thấy thoải mái hơn khi ở trong nhóm nhỏ hoặc một mình.
   - N (iNtuition): Bạn có xu hướng tìm hiểu về các cơ hội mới, sáng tạo và dành thời gian suy nghĩ về khả năng khác nhau thay vì chỉ tập trung vào chi tiết cụ thể.
   - F (Feeling): Cảm xúc và tác động của quyết định tới xung quanh là ưu tiên đối với bạn khi ra quyết định.
   - P (Perceiving): Bạn thích linh hoạt hơn, không bị ràng buộc quá nhiều bởi kế hoạch cụ thể và thích tuỳ cơ ứng biến.

3. **Tóm tắt MBTI:**
   - INFP là mẫu người lý tưởng hóa và giàu cảm xúc, thường quan tâm đến cảm giác của bản thân cũng như của mọi người xung quanh. Bạn thích sự linh hoạt, tự do khám phá và thường tìm kiếm ý nghĩa sâu sắc trong mọi việc.
#YÊU CẦU TƯ VẤN:
- Tôi đang làm LẬp trình viên.
- Tôi đang phân vân chở thành Solution Architect hay làm Project manager. Bạn hãy cho tôi lời khuyên.

#YÊU CẦU VỚI KẾT QUẢ
- Bạn hãy có lời khuyên lệch hẳn về một hướng (một vị trí công việc)
- Bạn KHÔNG được gợi ý thêm làm việc gì.
- Bạn KHÔNG đưa ra lời mời hay khuyến nghị để thiết kế mục tiêu sự nghiệp'));
    }
}
