getConfiguration(): Mengembalikan objek konfigurasi yang digunakan untuk mengkonfigurasi koneksi.

getLocalStreams(): Mengembalikan MediaStream lokal yang telah ditambahkan ke koneksi via addStream(). (Metode ini sudah usang dan mungkin akan dihapus di masa mendatang).

getRemoteStreams(): Mengembalikan semua MediaStream yang telah diterima dari remote peer. (Metode ini juga sudah usang).

getSenders(): Mengembalikan array dari semua objek RTCRtpSender yang dikaitkan dengan koneksi.

getReceivers(): Mengembalikan array dari semua objek RTCRtpReceiver yang dikaitkan dengan koneksi.

getTransceivers(): Mengembalikan array dari semua objek RTCRtpTransceiver yang dikaitkan dengan koneksi.

getStats(): Mengembalikan statistik tentang koneksi. Ini adalah metode yang sangat berguna untuk debugging dan pemantauan kualitas koneksi.

getIceConnectionState(): Mengembalikan keadaan dari koneksi ICE, seperti checking, connected, failed, dll.

getPeerIdentity(): Mengembalikan identitas dari remote peer jika telah diverifikasi.

getConnectionState(): Mengembalikan keadaan dari koneksi, seperti connected, disconnected, failed, dll.