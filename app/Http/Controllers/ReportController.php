<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('customer')->where('status', 'completed');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        return Inertia::render('Reports/Index', [
            'orders' => $query->latest()->get(),
            'totalRevenue' => $query->sum('order_total'),
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function downloadPdf(Request $request)
    {
        
        $orders = Order::with('customer') 
            ->where('status', 'completed')
            ->when($request->start_date && $request->end_date, function($q) use ($request){
                return $q->whereBetween('created_at', [$request->start_date, $request->end_date]);
            })->get();

        $data = [
            'title' => 'Sales Report',
            'date'  => now()->format('d/m/Y'),
            'orders' => $orders,
            'total' => $orders->sum('order_total')
        ];

        $pdf = Pdf::loadView('pdf.sales_report', $data);
        
        return $pdf->download('sales-report-'.now()->format('Y-m-d').'.pdf');
    }
}