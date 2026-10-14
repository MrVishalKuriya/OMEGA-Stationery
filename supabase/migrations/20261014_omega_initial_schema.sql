-- ==============================================================================
-- OMEGA WRITING NOTEBOOKS & STATIONERY - SUPABASE SCHEMA & RLS MIGRATION
-- Database Schema for Products, Categories, Enquiries, Settings, and Auth RBAC
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_sw TEXT NOT NULL,
    image TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name_en TEXT NOT NULL,
    name_sw TEXT,
    description_en TEXT,
    description_sw TEXT,
    size VARCHAR(50),
    quires_pages VARCHAR(100),
    paper_type VARCHAR(100),
    binding VARCHAR(100),
    quality_note TEXT,
    wholesale_price_tzs NUMERIC NOT NULL CHECK (wholesale_price_tzs >= 0),
    retail_price_tzs NUMERIC CHECK (retail_price_tzs >= 0),
    stock_status VARCHAR(50) NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low', 'out')),
    stock_quantity INTEGER NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
    min_order_qty INTEGER NOT NULL DEFAULT 1 CHECK (min_order_qty >= 1),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for high performance catalogue filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 4. Customer Enquiries & WhatsApp Orders Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_location TEXT NOT NULL,
    delivery_needed BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    items JSONB NOT NULL,
    total_tzs NUMERIC NOT NULL CHECK (total_tzs >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- 5. Site Settings Table (Editable via Admin Dashboard)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '+255715268391',
    phone_numbers TEXT[] NOT NULL DEFAULT ARRAY['+255715268391', '+255624265480', '+255699032777'],
    email TEXT DEFAULT 'indigoprinter06423@gmail.com',
    address TEXT DEFAULT 'P.O. Box 10424 Dar es Salaam, Tanzania',
    google_maps_url TEXT,
    tagline_en TEXT NOT NULL DEFAULT 'Quality for Every Page.',
    tagline_sw TEXT NOT NULL DEFAULT 'Ubora kwa Kila Ukurasa.',
    hero_title_en TEXT DEFAULT 'Tanzania''s Standard for Premium Writing Notebooks',
    hero_title_sw TEXT DEFAULT 'Kiwango cha Tanzania kwa Madaftari Bora ya Uandishi',
    think_positive_en TEXT DEFAULT 'Writing by hand sharpens intellect, organizes visions, and brings clarity to future leaders.',
    think_positive_sw TEXT DEFAULT 'Kuandika kwa mkono kunanoa fikra, kunapanga maono, na kuleta uwazi kwa viongozi wa kesho.',
    about_text_en TEXT DEFAULT 'OMEGA is dedicated to manufacturing high-durability school exercise books, counter books, and corporate ledgers with thread-sewn bindings and bleed-proof paper.',
    about_text_sw TEXT DEFAULT 'OMEGA inazalisha madaftari imara ya shule, counter books, na madaftari ya kiofisi yenye majalada magumu na karatasi zisizopenyeza wino.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin User Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CATEGORIES POLICIES
-- Anyone can view categories
CREATE POLICY "Public categories read" ON public.categories
    FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins category write" ON public.categories
    FOR ALL USING (public.is_admin());

-- PRODUCTS POLICIES
-- Anyone can view published products
CREATE POLICY "Public products read" ON public.products
    FOR SELECT USING (is_published = true OR public.is_admin());

-- Only admins can insert, update, or delete products
CREATE POLICY "Admins products manage" ON public.products
    FOR ALL USING (public.is_admin());

-- ENQUIRIES POLICIES
-- Any customer can insert their WhatsApp enquiry log
CREATE POLICY "Public enquiry submit" ON public.enquiries
    FOR INSERT WITH CHECK (true);

-- Only admins can view and manage enquiries
CREATE POLICY "Admins enquiry read" ON public.enquiries
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins enquiry update" ON public.enquiries
    FOR UPDATE USING (public.is_admin());

-- SITE SETTINGS POLICIES
-- Anyone can read active site settings
CREATE POLICY "Public settings read" ON public.site_settings
    FOR SELECT USING (true);

-- Only admins can update settings
CREATE POLICY "Admins settings update" ON public.site_settings
    FOR UPDATE USING (public.is_admin());

-- ADMIN USERS POLICIES
-- Only logged-in admins can view admin profiles
CREATE POLICY "Admin users read" ON public.admin_users
    FOR SELECT USING (public.is_admin());

-- ==============================================================================
-- INITIAL SEED DATA (OFFICIAL PPTX CATALOGUE & CATEGORIES)
-- ==============================================================================

INSERT INTO public.categories (id, slug, name_en, name_sw, image, display_order)
VALUES
    ('cat-counter', 'counter-books', 'Counter Books', 'Madaftari ya Kaunta', '/omega-products/counter-book-q3-catalog.jpeg', 1),
    ('cat-exercise', 'exercise-books', 'Exercise Books', 'Madaftari ya Shule', '/omega-products/exercise-book-100p-catalog.jpeg', 2),
    ('cat-bahasha', 'bahasha-envelopes', 'Bahasha & Envelopes', 'Bahasha za Khaki', '/omega-products/bahasha-a4-catalog.png', 3),
    ('cat-ruled', 'ruled-paper', 'Ruled Paper', 'Karatasi Zenye Mistari', '/omega-products/ruled-paper-catalog.jpeg', 4),
    ('cat-manila', 'manila-folders', 'Manila & Folders', 'Majalada na Folda za Manila', '/omega-products/manila-catalog.png', 5),
    ('cat-flipchart', 'flipcharts', 'Flipcharts', 'Karatasi za Flipchart', '/omega-products/flipchart-catalog.jpeg', 6),
    ('cat-stationery', 'school-stationery', 'School & Office Stationery', 'Vifaa vya Shule na Ofisi', '/omega-products/oxford-compass-catalog.jpeg', 7)
ON CONFLICT (id) DO NOTHING;

-- Initial Settings
INSERT INTO public.site_settings (id, whatsapp_number, phone_numbers, email, address, tagline_en, tagline_sw)
VALUES (
    'default',
    '+255715268391',
    ARRAY['+255715268391', '+255624265480', '+255699032777'],
    'indigoprinter06423@gmail.com',
    'P.O. Box 10424 Dar es Salaam, Tanzania',
    'Quality for Every Page.',
    'Ubora kwa Kila Ukurasa.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
