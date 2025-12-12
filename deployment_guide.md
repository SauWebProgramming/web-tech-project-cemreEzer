# GitHub Pages Kurulum ve Dağıtım Rehberi

## Standart Kurulum Adımları
1. GitHub reponuzda **Settings (Ayarlar)** sekmesine gidin.
2. Sol menüden **Pages** seçeneğine tıklayın.
3. **Build and deployment** altında **Source** kısmını **Deploy from a branch** olarak seçin.
4. **Branch** kısmında `main` (veya `master`) seçin ve yanındaki klasörü `/ (root)` olarak bırakıp **Save** butonuna tıklayın.
5. Birkaç dakika bekledikten sonra sayfayı yenileyin. Üst kısımda sitenizin yayınlandığı linki göreceksiniz. (Örn: `https://SauWebProgramming.github.io/web-tech-project-cemreEzer/`)

---

## Olası Sorunlar ve Çözümleri

### "Upgrade or make this repository public" Hatası


Eğer okulunuzun GitHub organizasyonu (SauWebProgramming) **Ücretsiz Plan** kullanıyorsa ve reponuz **Private (Gizli)** ise GitHub Pages özelliğini kullanamazsınız. Aldığınız **"Pages özelliğini etkinleştirmek için bu depoyu yükseltin veya herkese açık hale getirin"** hatası bunu göstermektedir.

Ödevinde hem "Repo Private olsun" hem de "Pages linki olsun" dendiği için bir çelişki var.

## Çözüm Seçenekleri

### Seçenek 1: Repoyu Public (Herkese Açık) Yapmak (Önerilen)
Video sunumunda linkin çalışması en önemli kriter olduğu için, repoyu Public yapman gerekebilir.
1. GitHub reponda **Settings** > **General** sekmesine git.
2. En aşağıya **Danger Zone** bölümüne in.
3. **Change repository visibility** butonuna tıkla.
4. **Change to public** seçeneğini seç ve onayla.
5. Şimdi **Settings** > **Pages** kısmına gidip `main` branch'ini seçip kaydedebilirsin.

> **Risk:** Ödev metninde "Private olmalı" yazdığı için, videoda veya teslim notunda "GitHub sistemsel olarak izin vermediği için mecburen Public yaptım" diye belirtmelisin.

### Seçenek 2: Başka Bir Servis Kullanmak (Netlify/Vercel)
Repon Private kalsın istiyorsan, GitHub Pages yerine Netlify veya Vercel kullanabilirsin. Bu servisler Private repoları ücretsiz yayınlar.
1. **[Netlify.com](https://www.netlify.com/)**'a git ve GitHub ile giriş yap.
2. "Add new site" > "Import an existing project" > "GitHub" seç.
3. `web-tech-project-cemreEzer` reponu seç.
4. **Deploy** butonuna bas.
5. Sana `https://proje-adi.netlify.app` gibi bir link verecektir. Bu linki teslim edebilirsin.

> **Risk:** Hocan ödevde özellikle "GitHub Pages" istemiş. Başka servis kabul edilmeyebilir.

## Özet
En garanti yol **Seçenek 1**'i denemektir. Hocalar genellikle çalışan link görmeyi, "Private" kuralından daha çok önemserler.
