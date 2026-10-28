'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Sparkles, DollarSign, Layers, Search, ShieldCheck, Boxes } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function CRUDProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State Tambah Produk
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // State Modal Edit & Hapus
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 1. Ambil data saat pertama kali dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Tambah Produk Baru
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert('Nama dan Harga wajib diisi!');

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          stock: Number(stock || 0),
        }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Gagal menambah produk');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  // 3. Simpan Perubahan Edit
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    try {
      const res = await fetch(`/api/tasks/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          price: editProduct.price,
          stock: editProduct.stock,
        }),
      });

      if (res.ok) {
        setEditProduct(null);
        fetchProducts();
      } else {
        alert('Gagal memperbarui produk');
      }
    } catch (err) {
      alert('Gagal memperbarui produk');
    }
  };

  // 4. Hapus Produk
  const handleDeleteProduct = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/tasks/${deleteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteId(null);
        fetchProducts();
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (err) {
      alert('Gagal menghapus produk');
    }
  };

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kalkulasi statistik
  const totalPrice = products.reduce((acc, curr) => acc + Number(curr.price), 0);
  const totalStock = products.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] py-8 px-6 lg:px-12">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 animate-pulse"></div>
              <div className="relative p-4 bg-slate-900 border border-slate-800 text-indigo-400 rounded-2xl shadow-2xl">
                <Sparkles className="w-9 h-9" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ProdukHub
                </h1>
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 font-bold">
                  PRO V2.0
                </Badge>
              </div>
              <p className="text-slate-400 text-base mt-1.5 font-medium">
                Sistem Manajemen Produk Berkecepatan Tinggi • Next.js & Aiven MySQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-5 py-3 rounded-2xl shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-300">Aiven Secure DB</span>
            </div>
          </div>
        </div>

        {/* Grid Statistik Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg hover:border-indigo-500/50 transition-all group">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Item</p>
                <h3 className="text-3xl font-black text-white mt-1">{products.length} <span className="text-base font-normal text-slate-400">Produk</span></h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg hover:border-purple-500/50 transition-all group">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Valuasi</p>
                <h3 className="text-3xl font-black text-white mt-1">Rp {totalPrice.toLocaleString('id-ID')}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg hover:border-emerald-500/50 transition-all group">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Boxes className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stok Tersedia</p>
                <h3 className="text-3xl font-black text-white mt-1">{totalStock} <span className="text-base font-normal text-slate-400">Unit</span></h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layout Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Form Tambah Produk */}
          <div className="lg:col-span-4">
            <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Plus className="w-6 h-6 bg-white/20 p-1 rounded-lg" /> Tambah Produk
                </CardTitle>
                <CardDescription className="text-indigo-100 text-sm mt-1.5">
                  Input data baru untuk langsung masuk ke database cloud.
                </CardDescription>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nama Produk</Label>
                    <Input
                      id="name"
                      placeholder="Cth: Mechanical Keyboard"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-indigo-500 h-12 text-base px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deskripsi</Label>
                    <Textarea
                      id="desc"
                      placeholder="Keterangan singkat spesifikasi..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="rounded-xl border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-indigo-500 resize-none text-base p-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Harga (Rp)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="rounded-xl border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-indigo-500 h-12 text-base px-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stok Unit</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        className="rounded-xl border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-indigo-500 h-12 text-base px-4"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl h-12 text-base shadow-lg shadow-indigo-600/30 transition-all mt-3"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Produk'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Tabel Data */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Bar Pencarian */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Cari nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-slate-800 bg-slate-950 text-white text-base focus:border-indigo-500"
                />
              </div>
              <div className="text-sm text-slate-400 font-semibold whitespace-nowrap">
                Menampilkan <span className="text-white text-base font-bold">{filteredProducts.length}</span> dari {products.length} produk
              </div>
            </div>

            {/* Tabel Utama — SEMUA KOLOM RATA TENGAH (text-center) */}
            <div className="border border-slate-800/80 rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-2xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-5 px-6 font-bold text-center">ID / Produk</th>
                      <th className="py-5 px-6 font-bold text-center">Deskripsi</th>
                      <th className="py-5 px-6 font-bold text-center">Harga (Rp)</th>
                      <th className="py-5 px-6 font-bold text-center">Stok Unit</th>
                      <th className="py-5 px-6 font-bold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-500 font-medium text-lg">
                          {products.length === 0 ? 'Belum ada data produk tersimpan.' : 'Produk yang dicari tidak ditemukan.'}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((item) => (
                        <tr key={item.id} className="hover:bg-indigo-950/30 transition-colors group">
                          {/* PRODUK (RATA TENGAH) */}
                          <td className="py-6 px-6 font-bold text-white">
                            <div className="flex items-center justify-center gap-3.5">
                              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm shadow-inner">
                                #{item.id}
                              </span>
                              <span className="text-lg text-white font-bold group-hover:text-indigo-300 transition-colors">{item.name}</span>
                            </div>
                          </td>

                          {/* DESKRIPSI (RATA TENGAH) */}
                          <td className="py-6 px-6 text-slate-300 max-w-[240px] truncate text-base text-center">
                            {item.description || <span className="text-slate-600 italic">Tanpa deskripsi</span>}
                          </td>
                          
                          {/* HARGA (RATA TENGAH) */}
                          <td className="py-6 px-6 whitespace-nowrap text-center">
                            <span className="font-black text-emerald-400 text-xl">
                              Rp {Number(item.price).toLocaleString('id-ID')}
                            </span>
                          </td>

                          {/* STOK (RATA TENGAH) */}
                          <td className="py-6 px-6 whitespace-nowrap text-center">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-3.5 py-1.5 font-bold rounded-xl border ${
                                (item.stock ?? 0) > 0 
                                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40' 
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                              }`}
                            >
                              Stok: {item.stock ?? 0} unit
                            </Badge>
                          </td>

                          {/* AKSI (RATA TENGAH) */}
                          <td className="py-6 px-6 text-center space-x-3 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-bold border border-slate-800/60"
                              onClick={() => setEditProduct(item)}
                            >
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 px-4 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/60 text-sm font-bold border border-rose-900/30"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Hapus
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Edit Produk */}
        <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
          <DialogContent className="rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl max-w-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Pencil className="w-6 h-6 text-indigo-400" /> Edit Data Produk
              </DialogTitle>
            </DialogHeader>
            {editProduct && (
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Produk</Label>
                  <Input
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    className="rounded-xl border-slate-800 bg-slate-950 text-white h-12 text-base px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi</Label>
                  <Textarea
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, description: e.target.value })
                    }
                    className="rounded-xl border-slate-800 bg-slate-950 text-white resize-none text-base p-4"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga (Rp)</Label>
                    <Input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="rounded-xl border-slate-800 bg-slate-950 text-white h-12 text-base px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stok Unit</Label>
                    <Input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock: Number(e.target.value),
                        })
                      }
                      className="rounded-xl border-slate-800 bg-slate-950 text-white h-12 text-base px-4"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="gap-3 pt-3">
              <Button variant="outline" className="rounded-xl border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 px-6 text-base font-semibold" onClick={() => setEditProduct(null)}>
                Batal
              </Button>
              <Button onClick={handleUpdateProduct} className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 text-base">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Konfirmasi Hapus */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl max-w-lg p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-white">Konfirmasi Penghapusan</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 text-base mt-2">
                Tindakan ini permanen. Data produk yang dipilih akan dihapus detik ini juga dari server database Aiven Cloud.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 pt-4">
              <AlertDialogCancel className="rounded-xl border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 px-6 text-base font-semibold" onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProduct} className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold h-11 px-6 text-base">
                Ya, Hapus Permanen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}