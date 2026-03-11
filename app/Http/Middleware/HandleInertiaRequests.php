<?php

namespace App\Http\Middleware;

use App\Models\Dependency;
use App\Models\Sheet_number;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load("roles") : [],
            ],
            "notifications" => $request->user() ? $request->user()->notifications : null,
            'flash' => fn() => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'status' => $request->session()->get('status'),
            ],
            "sheets" => $request->user() ? ($request->user()->hasRole("Instructor") ? $request->user()->sheetNumbers()->with("dependencies")->get() : Sheet_number::with("dependencies")->get()) : [],
            // "dependencies" => $request->user() ? ($request->user()->hasRole("Instructor") ? Dependency::whereIn('sheet_number_id', $request->user()->sheetNumbers->pluck('id'))->get() : Dependency::all()) : [],
        ];
    }
}
