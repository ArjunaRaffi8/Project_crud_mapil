import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { log } from 'console';

// Update Produk (PUT)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, description, price, stock } = body;

    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description, Number(price), Number(stock || 0), id]
    );

    return NextResponse.json({ message: 'Produk berhasil diperbarui!' });
  } catch (error: any) {
    console.error('ERROR PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Hapus Produk (DELETE)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Produk berhasil dihapus!' });
  } catch (error: any) {
    console.error('ERROR DELETE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
