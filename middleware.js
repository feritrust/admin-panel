// middleware.js
export function middleware(req) {
  // این middleware عملاً کاری نمی‌کنه فعلاً
  return NextResponse.next();
}

export const config = {
  matcher: [], // همه مسیرها غیرفعال
};
