import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Ambil Semua Produk (GET)
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('ERROR GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Tambah Produk Baru (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Nama dan harga wajib diisi!' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description || '', Number(price), Number(stock || 0)]
    );

    return NextResponse.json(
      { message: 'Produk berhasil ditambahkan', id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('ERROR POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}