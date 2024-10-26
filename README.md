
# Language Catcher 

Language Catcher websitelerin dilini detekte etmeye çalışan bir chrome eklentisidir.Bir ya da birden fazla urlin dilini detekte ederek otomasyona yardımcı olur.

## Proje İçeriği

Projenin backend kısmında kullanıcı auth işlemleri vardır.Aynı zamanda aranan urlleri kullanıcılara kaydettiğimiz, sildiğimiz ve kullanıcı verilerini getirdiğimiz kısım vardır.

Projenin client kısmında bir uygulama ui kısmı vardır.Giriş çıkış yaparak kullanılabilir.Url arayabilirsiniz.Bütün istekleri eklenti üzerinden karşılanır.

Extension kısmında eklentinin kendisi bulunmaktadır.Nasıl kullanıldığı hakkında bilgiyi dokümantasyon kısmında ulaşabilirsiniz.


## Bilgisayarınızda Çalıştırın

Projeyi klonlayın

```bash
  git clone https://github.com/efilli/language-catcher.git
```

### Client



Proje dizinine gidin

```bash
  cd application
```
```bash
  cd client
```

Gerekli paketleri yükleyin

```bash
  npm install
```

Sunucuyu çalıştırın

```bash
  npm run dev
```

### Server


Proje dizinine gidin

```bash
  cd application
```
```bash
  cd server
```

Gerekli paketleri yükleyin

```bash
  npm install
```

Sunucuyu çalıştırın

```bash
  npm run dev
```  

### Extension


Proje dizinine gidin

```bash
  cd extension
```

Gerekli paketleri yükleyin

```bash
  npm install
```

Sunucuyu çalıştırın

```bash
  npm run dev
```  
## Özellikler

- Websitelerin dil ile alakalı kısımlarını toplayarak güvenilir bir dil sonucu gönderir.
- Websitelerin içeriklerinin de dilini kontrol eder.
- Kullanıcı giriş çıkışı sağlar.
- Detekte edilen verileri saklar ve tabloda gösterir.
- Farklı entegrasyon yöntemleri sunar.
- Sadece verileri kullanma olanağı sunar.

  
## Kullanılan Teknolojiler

**Client:** Vue.js ,TypeScript, UnoCSS

**Server:** Node.js, Express.js, TypeScript ,bcrypt.js , jwt

**Extension:** TypeScript , Vue.js ,UnoCSS , Chrome API , crxjs

  
## Dokümantasyon

Eklentiyi kullanmak için detaylı bilgiye eklenti dokümantasyonundan ulaşabilirsiniz.

https://furkans-organization-12.gitbook.io/language-catcher-dokumantasyon

  