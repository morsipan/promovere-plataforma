import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const rememberMe = Boolean(body?.rememberMe);

    if (!email || !password) {
      return NextResponse.json(
        { errors: [{ message: 'Ingresá tu correo electrónico y contraseña.' }] },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    });

    if (!result?.token || !result?.user) {
      return NextResponse.json(
        { errors: [{ message: 'Credenciales inválidas o cuenta no registrada.' }] },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: result.user,
      exp: result.exp,
    });

    const cookiePrefix = payload.config.cookiePrefix || 'payload';
    const cookieName = `${cookiePrefix}-token`;

    // Si "Recordar cuenta" está activado, persistimos la cookie 30 días.
    // Caso contrario, la dejamos como cookie de sesión (se cierra al cerrar el navegador).
    response.cookies.set(cookieName, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(rememberMe ? { maxAge: THIRTY_DAYS_SECONDS } : {}),
    });

    return response;
  } catch (err: any) {
    const message =
      err?.data?.errors?.[0]?.message ||
      err?.message ||
      'Credenciales inválidas o cuenta no registrada.';

    return NextResponse.json(
      { errors: [{ message }] },
      { status: err?.status || 401 }
    );
  }
}
