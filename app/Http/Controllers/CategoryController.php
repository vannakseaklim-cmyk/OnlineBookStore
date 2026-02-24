<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $rsDatas = Category::latest()->paginate(10)->appends(request()->query());

        return Inertia::render('Categories/Index', [
            'categoryData' => $rsDatas
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/CreateEdit', [
            'datas' => ''
        ]);
    }

    public function store(Request $request, Category $model)
    {
        $model->create($request->validate([
            'name' => ['required', 
                        'max:255',
                        'regex:/[a-zA-Z]/',
                        'unique:categories,name'
                    ],
            'status' => 'required|boolean',
        ]));
        return redirect()->route('categories.index');
       
    }

    public function show(Category $category, $id)
    {
        //
    }

    public function edit(Category $category, $id)
    {
        $rsDatasModel = Category::find($id);
        return Inertia::render('Categories/CreateEdit', [
            'datas' => $rsDatasModel
        ]);
    }

    public function update(Request $request, Category $model, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);
        
        $rsDatasModel = Category::find($id);
        $rsDatasModel->update($request->all());

        return redirect()->route('categories.index');
    }

    public function destroy(Category $id)
    {
        if ($id->books()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete category: It is currently used by ' 
                    . $id->books()->count() . ' books.'
            ]);
        }

        $id->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
