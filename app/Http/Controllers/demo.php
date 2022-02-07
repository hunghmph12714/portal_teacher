<?php

class demo extends Controller
{
    public function saveEdit($id, Request $request)
    {
        $request->validate(
            [
                "title" => "required",
            ],
            [
                "title.required" => "bạn phải nhập tiêu đề"
            ]
        );
        // dd($request);
        $model = Post::find($id);
        $model->fill($request->all());
        $model->save();
        if ($request->has('file')) {
            $file =   FileDocumentPost::where('post_id', $id)->get();
            // dd($file);
            foreach ($file as $key => $value) {
                Storage::delete($value->filename);
                echo ($value);
                $value->delete();
            }


            foreach ($request->file as $item) {
                $filename = $item->storeAs('file_document_post', date('d_m_Y') . '_' . random_int(0, 9999999) . '_' . $item->getClientOriginalName());
                FileDocumentPost::create([
                    'post_id' => $id,
                    'filename' => $filename
                ]);
            }
            // echo ($item->getClientOriginalName());
        }
        return redirect(route('post.index'));
    }
    public function deletePost($id)
    {
        $listfile = FileDocumentPost::where('post_id', $id)->get();
        foreach ($listfile as  $value) {
            // echo ($value);
            Storage::delete($value->filename);
        }
        $listfile->load('file_document_post')->delete();
        // $listlink = LinkDocumentPost::where('post_id', $id)->delete();

        Post::find($id)->delete();
        return redirect(route('post.index'));
    }
    public function downloadFile($id)
    {
        $file = FileDocumentPost::find($id);
        $filePath = storage_path("app/" . $file->filename);
        // dd($filePath);
        return  response()->download($filePath);
    }
}