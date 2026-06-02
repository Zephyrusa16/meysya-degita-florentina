Panduan edit singkat
====================

File utama:
- index.html  : isi halaman, teks, struktur section, surat, dan pesan rahasia.
- styles.css  : warna, layout, animasi visual, hero, dan placeholder foto.
- script.js   : typewriter, lightbox, music player, secret message, floating hearts, dan confetti.

Bagian yang paling sering diedit:
1. Mengubah teks pembuka typewriter
   Buka script.js, ubah isi variabel intro.

2. Mengubah surat personal
   Buka index.html, cari bagian "PAGE 3: Personal Letter", lalu edit paragrafnya.

3. Mengubah secret message
   Buka index.html, cari bagian "PAGE 4: Secret Message", lalu edit teks di class secret-message.

4. Mengganti foto hero
   Simpan foto di folder outputs, misalnya meysya.jpg.
   Buka styles.css, cari .hero-photo, lalu ikuti komentar yang ada di sana.

5. Mengganti foto gallery
   Foto gallery sekarang ada di folder outputs/gallery:
   - gallery/1.jpg
   - gallery/2.jpg
   - gallery/3.jpg
   - gallery/4.jpg
   Jika ingin mengganti, cukup replace file dengan nama yang sama.
   Buka styles.css, cari .photo-one, .photo-two, .photo-three, .photo-four.
   Jika nama file berbeda, ganti background-image sesuai nama file foto.

6. Mengubah warna website
   Buka styles.css, cari :root di bagian paling atas.
   Ubah kode warna seperti --pink, --cream, --lavender, dan --rose.

7. Mengubah watermark dan Instagram
   Buka index.html, cari bagian footer class="watermark".
   Watermark sekarang berisi:
   - zephyrusa
   - ikon Instagram + ridhosaptra_16
   - ikon Instagram + deflomy

Catatan:
- Website ini bisa dibuka langsung dari index.html.
- Background music dibuat dengan Web Audio API, jadi tidak butuh file audio eksternal.
- Musik baru bisa menyala setelah tombol Music diklik, karena aturan browser modern.
