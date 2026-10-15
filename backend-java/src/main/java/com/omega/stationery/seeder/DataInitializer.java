package com.omega.stationery.seeder;

import com.omega.stationery.model.Product;
import com.omega.stationery.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final ProductRepository productRepository;
    private final com.omega.stationery.service.AuthService authService;

    public DataInitializer(ProductRepository productRepository, com.omega.stationery.service.AuthService authService) {
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        try {
            long count = productRepository.count();
            if (count == 0) {
                log.info("🌱 [MongoDB Seeder] No products found in MongoDB. Initializing OMEGA Stationery catalog...");
                seedCatalog();
                log.info("✅ [MongoDB Seeder] Successfully seeded {} products into MongoDB!", productRepository.count());
            } else {
                log.info("📦 [MongoDB Seeder] Catalog already contains {} products. Skipping initial seed.", count);
            }

            // Seed default users (mussa.juma@omega.co.tz, admin@omega.co.tz)
            authService.seedDefaultUsersIfEmpty();

        } catch (Exception e) {
            log.warn("⚠️ [MongoDB Seeder] Notice on startup: {}", e.getMessage());
        }
    }

    public void seedCatalog() {
        List<Product> list = new ArrayList<>();

        // 1. Counter Book Q2
        Product q2 = new Product("prod-omega-cb-q2", "OMEGA Hardcover Counter Book Q2 (192 Pages)", "Counter Books", 56000.0, "OMG-CB-Q2", "In Stock");
        q2.setNameSw("OMEGA Daftari la Kaunta Q2 (Kurasa 192)");
        q2.setDiscountPrice(52000.0);
        q2.setWholesalePrice(48000.0);
        q2.setWholesaleMinQty(10);
        q2.setImage("/omega-products/counter-book-q2-192p.jpeg");
        q2.setGallery(Arrays.asList("/omega-products/counter-book-q2-192p.jpeg", "/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg"));
        q2.setDescription("Heavyweight OMEGA 2-Quire counter book with 192 numbered pages. Bound in scratch-resistant stiff hardboard with reinforced cloth spine and indexed header label. Perfect for daily office registry, accounting ledger, and academic note-taking.");
        q2.setDescriptionSw("Daftari la kaunta la OMEGA Quire 2 lenye kurasa 192 zilizopangwa kwa ustadi. Jalada gumu lisilopinda kwa matumizi ya biashara na elimu.");
        q2.setQuire("2 Quire");
        q2.setPageCount("192 Pages");
        q2.setSize("A4");
        q2.setPaperType("70 GSM Bleed-Proof");
        q2.setBinding("Thread-Sewn Hardboard with Reinforced Spine");
        q2.setFeatured(true);
        q2.setBestSeller(true);
        q2.setRating(5.0);
        q2.setReviewCount(148);
        q2.setSpecifications(Arrays.asList(
                new Product.Specification("Page Count", "192 Pages (2 Quire)"),
                new Product.Specification("Binding", "Thread-Sewn Hardboard"),
                new Product.Specification("Ruling", "Feint Ruled with Left Red Margin"),
                new Product.Specification("Manufacturer", "OMEGA Indigo Printer · Tanzania")
        ));
        list.add(q2);

        // 2. Counter Book Q3
        Product q3 = new Product("prod-omega-cb-q3", "OMEGA Hardcover Counter Book Q3 (288 Pages)", "Counter Books", 57000.0, "OMG-CB-Q3", "In Stock");
        q3.setNameSw("OMEGA Daftari la Kaunta Q3 (Kurasa 288)");
        q3.setDiscountPrice(53000.0);
        q3.setWholesalePrice(49000.0);
        q3.setWholesaleMinQty(10);
        q3.setImage("/omega-products/counter-book-q3-288p.jpeg");
        q3.setGallery(Arrays.asList("/omega-products/counter-book-q3-288p.jpeg", "/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg"));
        q3.setDescription("The premier 3-Quire standard counter book in Tanzania. 288 bleed-proof smooth white pages, double-thread stitching, and archival grade durable cover.");
        q3.setDescriptionSw("Kipenzi cha ofisi na biashara kote Tanzania. Quire 3 yenye kurasa 288, jalada gumu na mistari iliyonyooka.");
        q3.setQuire("3 Quire");
        q3.setPageCount("288 Pages");
        q3.setSize("A4");
        q3.setPaperType("70 GSM Bleed-Proof");
        q3.setBinding("Thread-Sewn Hardboard with Reinforced Spine");
        q3.setFeatured(true);
        q3.setBestSeller(true);
        q3.setRating(5.0);
        q3.setReviewCount(212);
        q3.setSpecifications(Arrays.asList(
                new Product.Specification("Page Count", "288 Pages (3 Quire)"),
                new Product.Specification("Binding", "Thread-Sewn Heavy Spine"),
                new Product.Specification("Ruling", "Feint Ruled with Left Red Margin")
        ));
        list.add(q3);

        // 3. Counter Book Q4
        Product q4 = new Product("prod-omega-cb-q4", "OMEGA Hardcover Counter Book Q4 (384 Pages)", "Counter Books", 60000.0, "OMG-CB-Q4", "In Stock");
        q4.setNameSw("OMEGA Daftari la Kaunta Q4 (Kurasa 384)");
        q4.setDiscountPrice(56000.0);
        q4.setWholesalePrice(52000.0);
        q4.setWholesaleMinQty(8);
        q4.setImage("/omega-products/counter-book-q4-384p.jpeg");
        q4.setGallery(Arrays.asList("/omega-products/counter-book-q4-384p.jpeg", "/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg"));
        q4.setDescription("Maximum-capacity 4-Quire heavy archival ledger book. 384 pages designed for long-term company records, warehouse inventories, and institution registries.");
        q4.setDescriptionSw("Daftari kubwa zaidi lenye kurasa 384 (Quire 4). Jalada thabiti linalohifadhi mahesabu na kumbukumbu miaka mingi.");
        q4.setQuire("4 Quire");
        q4.setPageCount("384 Pages");
        q4.setSize("A4");
        q4.setPaperType("70 GSM Bleed-Proof");
        q4.setBinding("Thread-Sewn Heavy Hardboard");
        q4.setFeatured(true);
        q4.setBestSeller(false);
        q4.setRating(4.9);
        q4.setReviewCount(94);
        list.add(q4);

        // 4. Exercise Book 200p Purple
        Product ex200 = new Product("prod-omega-ex-200sl", "OMEGA Student Exercise Book 200 Pages (Single Line)", "Exercise Books", 22000.0, "OMG-EX-200SL", "In Stock");
        ex200.setNameSw("Daftari la Wanafunzi OMEGA Kurasa 200 (Single Line)");
        ex200.setDiscountPrice(19500.0);
        ex200.setWholesalePrice(17500.0);
        ex200.setWholesaleMinQty(20);
        ex200.setImage("/omega-products/exercise-book-200p-purple.jpeg");
        ex200.setGallery(Arrays.asList("/omega-products/exercise-book-200p-purple.jpeg", "/omega-products/catalog-sheet-exercise-200-sl-dl-sq.jpeg"));
        ex200.setDescription("Official national secondary and primary curriculum exercise book with 200 feint ruled pages, glossy wipe-clean purple cover, and educational multiplication table printed on the back.");
        ex200.setDescriptionSw("Daftari rasmi la mwanafunzi lenye kurasa 200, jalada la zambarau lenye mvuto na karatasi isiyopenyeza wino.");
        ex200.setPageCount("200 Pages");
        ex200.setSize("A5");
        ex200.setPaperType("60 GSM OMEGA Standard");
        ex200.setBinding("Saddle Stitched Heavy Staples");
        ex200.setFeatured(true);
        ex200.setBestSeller(true);
        ex200.setRating(4.9);
        ex200.setReviewCount(310);
        list.add(ex200);

        // 5. Exercise Book 200p Double Line
        Product ex200dl = new Product("prod-omega-ex-200dl", "OMEGA Student Exercise Book 200 Pages (Double Line)", "Exercise Books", 22000.0, "OMG-EX-200DL", "In Stock");
        ex200dl.setNameSw("Daftari la Mazoezi OMEGA Kurasa 200 (Double Line)");
        ex200dl.setImage("/omega-products/exercise-book-200p-whitered.jpeg");
        ex200dl.setDescription("Double-line ruled 200-page notebook engineered for penmanship, junior school handwriting perfection, and language classes.");
        ex200dl.setPageCount("200 Pages");
        ex200dl.setSize("A5");
        ex200dl.setStockStatus("In Stock");
        list.add(ex200dl);

        // 6. Exercise Book 200p Square Grid
        Product ex200sq = new Product("prod-omega-ex-200sq", "OMEGA Mathematics Exercise Book 200 Pages (Square Grid)", "Exercise Books", 22000.0, "OMG-EX-200SQ", "In Stock");
        ex200sq.setNameSw("Daftari la Hisabati OMEGA Kurasa 200 (Square Grid)");
        ex200sq.setImage("/omega-products/exercise-book-200p-purple.jpeg");
        ex200sq.setDescription("Precision blue millimeter square grid ruling for mathematics, geometry, statistics, and science calculations.");
        ex200sq.setPageCount("200 Pages");
        ex200sq.setSize("A5");
        list.add(ex200sq);

        // 7. Exercise Book 100p Pink
        Product ex100 = new Product("prod-omega-ex-100p", "OMEGA Student Exercise Book 100 Pages", "Exercise Books", 14000.0, "OMG-EX-100P", "In Stock");
        ex100.setNameSw("Daftari la Wanafunzi OMEGA Kurasa 100");
        ex100.setImage("/omega-products/exercise-book-100p-pink.jpeg");
        ex100.setDescription("Convenient 100-page intermediate exercise book with bright pink cover. Ideal for homework, revision, and terminal tests.");
        ex100.setPageCount("100 Pages");
        ex100.setSize("A5");
        list.add(ex100);

        // 8. Exercise Book 80p Yellow
        Product ex80 = new Product("prod-omega-ex-80p", "OMEGA Exercise Book 80 Pages (Yellow Cover)", "Exercise Books", 11000.0, "OMG-EX-80P", "In Stock");
        ex80.setNameSw("Daftari la Mazoezi OMEGA Kurasa 80 (Jalada la Njano)");
        ex80.setImage("/omega-products/exercise-book-80p-yellow.jpeg");
        ex80.setDescription("Standard 80-page classroom exercise book. High opacity white writing paper.");
        ex80.setPageCount("80 Pages");
        ex80.setSize("A5");
        list.add(ex80);

        // 9. Exercise Book 32p Kraft
        Product ex32 = new Product("prod-omega-ex-32p", "OMEGA Slim Exercise Book 32 Pages (Kraft Series)", "Exercise Books", 6000.0, "OMG-EX-32P", "In Stock");
        ex32.setNameSw("Daftari Dogo la OMEGA Kurasa 32");
        ex32.setImage("/omega-products/exercise-book-32p-kraft.jpeg");
        ex32.setDescription("Affordable 32-page workbook for quiz tests, laboratory experiments, and nursery exercises.");
        ex32.setPageCount("32 Pages");
        ex32.setSize("A5");
        list.add(ex32);

        // 10. Heavy Stiff Cover 200p
        Product stiff200 = new Product("prod-omega-stiff-200", "OMEGA Stiff Cover Hardcover Notebook 200 Pages", "Counter Books", 45000.0, "OMG-STIFF-200", "In Stock");
        stiff200.setNameSw("Daftari la Jalada Ngumu OMEGA Kurasa 200");
        stiff200.setImage("/omega-products/stiff-cover-200p-black.jpeg");
        stiff200.setDescription("Rigid executive hardcover with black marble motif. Combines the compact portability of an exercise book with counter book durability.");
        stiff200.setPageCount("200 Pages");
        stiff200.setSize("A5");
        list.add(stiff200);

        // 11. Bahasha A4 Heavy Kraft
        Product bahashaA4 = new Product("prod-omega-bahasha-a4", "OMEGA Heavy Kraft Bahasha Envelopes A4 (Pack of 250)", "Bahasha & Envelopes", 38000.0, "OMG-ENV-A4", "In Stock");
        bahashaA4.setNameSw("Bahasha Nzito za OMEGA A4 (Box la 250)");
        bahashaA4.setImage("/omega-products/bahasha-a4-box.jpeg");
        bahashaA4.setDescription("Tear-resistant unbleached pure virgin kraft paper envelopes designed for legal files, court transcripts, and official postal correspondence.");
        bahashaA4.setSize("A4");
        bahashaA4.setWholesalePrice(34000.0);
        bahashaA4.setFeatured(true);
        list.add(bahashaA4);

        // 12. Bahasha A3 Postal
        Product bahashaA3 = new Product("prod-omega-bahasha-a3", "OMEGA Large Parcel Kraft Bahasha A3 (Pack of 100)", "Bahasha & Envelopes", 32000.0, "OMG-ENV-A3", "In Stock");
        bahashaA3.setNameSw("Bahasha Kubwa za OMEGA A3 (Pakiti ya 100)");
        bahashaA3.setImage("/omega-products/bahasha-a3-envelope.jpeg");
        bahashaA3.setDescription("Extra-wide A3 format kraft mailers for architectural blueprints, certificate diplomas, and oversized documents.");
        bahashaA3.setSize("A3");
        list.add(bahashaA3);

        // 13. Bahasha A5 Compact
        Product bahashaA5 = new Product("prod-omega-bahasha-a5", "OMEGA Document Envelopes A5 (Pack of 250)", "Bahasha & Envelopes", 26000.0, "OMG-ENV-A5", "In Stock");
        bahashaA5.setNameSw("Bahasha za OMEGA A5 (Box la 250)");
        bahashaA5.setImage("/omega-products/bahasha-a5-catalog.jpeg");
        bahashaA5.setDescription("Everyday office correspondence kraft envelope for half-sheet statements and receipts.");
        bahashaA5.setSize("A5");
        list.add(bahashaA5);

        // 14. Bahasha A6 Pocket
        Product bahashaA6 = new Product("prod-omega-bahasha-a6", "OMEGA Pay-Slip & Money Bahasha A6 (Pack of 500)", "Bahasha & Envelopes", 22000.0, "OMG-ENV-A6", "In Stock");
        bahashaA6.setNameSw("Bahasha za Mishahara OMEGA A6 (Box la 500)");
        bahashaA6.setImage("/omega-products/bahasha-a6-box.jpeg");
        bahashaA6.setDescription("Pocket size security envelope for payroll disbursements, cashier receipts, and small vouchers.");
        bahashaA6.setSize("A6");
        list.add(bahashaA6);

        // 15. Examination Ruled Paper
        Product ruledPaper = new Product("prod-omega-ruled-paper", "OMEGA Official Examination Ruled Paper (Ream / 500 Sheets)", "Ruled Paper", 28000.0, "OMG-RP-500", "In Stock");
        ruledPaper.setNameSw("Karatasi za Mitihani OMEGA Zenye Mistari (Ream 500)");
        ruledPaper.setImage("/omega-products/ruled-paper-ream-tall.jpeg");
        ruledPaper.setDescription("Double-sided precision ruled sheets conforming to National Examination Council (NECTA) standards. Margin on left, crisp faint blue ruling.");
        ruledPaper.setSize("A4");
        ruledPaper.setFeatured(true);
        list.add(ruledPaper);

        // 16. Flipchart Presentation Paper
        Product flipchart = new Product("prod-omega-flipchart", "OMEGA Presentation Flipchart Paper (Stack of 50 Sheets)", "Flipcharts", 35000.0, "OMG-FC-50", "In Stock");
        flipchart.setNameSw("Karatasi za Flipchart za OMEGA (Pakiti ya 50)");
        flipchart.setImage("/omega-products/flipchart-stack-large.jpeg");
        flipchart.setDescription("Heavy-weight giant easel pad paper for conference rooms, training seminars, workshops, and classroom lectures.");
        flipchart.setSize("Standard Easel");
        list.add(flipchart);

        // 17. Manila File Folders
        Product manilaFolder = new Product("prod-omega-manila-folder", "OMEGA Heavyweight Manila File Folders (Bundle of 100)", "Manila & Folders", 25000.0, "OMG-MF-100", "In Stock");
        manilaFolder.setNameSw("Mafaili ya Manila ya OMEGA (Mfungo wa 100)");
        manilaFolder.setImage("/omega-products/manila-file-folder-flat.jpeg");
        manilaFolder.setDescription("Classic buff-yellow high-density manila cardstock folders with pre-punched fastener slots.");
        list.add(manilaFolder);

        // 18. PVC Spring File
        Product pvcSpring = new Product("prod-omega-pvc-spring", "OMEGA Executive PVC Spring Action File", "Files & Folders", 7500.0, "OMG-PVC-SPR", "In Stock");
        pvcSpring.setNameSw("Faili la Kisasa la PVC Spring OMEGA");
        pvcSpring.setImage("/omega-products/omega-pvc-spring-file.jpeg");
        pvcSpring.setDescription("Durable moisture-proof plastic binder with heavy stainless steel spring clamp mechanism.");
        list.add(pvcSpring);

        // 19. Oxford Mathematical Geometry Set
        Product mathSet = new Product("prod-omega-math-set", "Oxford Mathematical Instruments Geometry Set", "School Stationery", 9500.0, "OMG-MS-OXF", "In Stock");
        mathSet.setNameSw("Vifaa vya Jiometria vya Oxford (Math Set)");
        mathSet.setImage("/omega-products/oxford-mathematical-set.jpeg");
        mathSet.setDescription("Tin box containing die-cast metal compass, divider, 15cm ruler, 180° protractor, set squares, sharpener, and eraser.");
        mathSet.setFeatured(true);
        list.add(mathSet);

        // 20. Shorthand Spiral Notebook
        Product shorthand = new Product("prod-omega-shorthand", "OMEGA Wire-Bound Shorthand Steno Notebook (160 Pages)", "Registers", 8500.0, "OMG-SN-160", "In Stock");
        shorthand.setNameSw("Daftari la Shorthand la OMEGA (Kurasa 160)");
        shorthand.setImage("/omega-products/omega-shorthand-notebook.jpeg");
        shorthand.setDescription("Top-spiral notebook with center-line ruling for reporters, secretaries, meeting minutes, and field research.");
        list.add(shorthand);

        // 21. Petty Cash Voucher
        Product pettyCash = new Product("prod-omega-petty-cash", "OMEGA Accounting Petty Cash Vouchers (Pad of 100)", "Office Supplies", 6000.0, "OMG-PCV-100", "In Stock");
        pettyCash.setNameSw("Voucher za Petty Cash OMEGA (Kitabu cha 100)");
        pettyCash.setImage("/omega-products/omega-petty-cash-voucher.jpeg");
        pettyCash.setDescription("Sequential duplicate vouchers for office expense tracking and bookkeeping audit.");
        list.add(pettyCash);

        // 22. OMEGA Master Carton Box
        Product cartonBox = new Product("prod-omega-carton-box", "OMEGA Branded Corrugated Shipping Cartons (Bundle of 25)", "Packaging & Cartons", 45000.0, "OMG-CTN-25", "In Stock");
        cartonBox.setNameSw("Maboksi ya Kusafirishia ya OMEGA (Mfungo wa 25)");
        cartonBox.setImage("/omega-products/omega-carton-box-branded.jpeg");
        cartonBox.setDescription("Double-wall 5-ply corrugated cardboard boxes for parcel shipment to upcountry regions across Tanzania.");
        list.add(cartonBox);

        productRepository.saveAll(list);
    }
}
