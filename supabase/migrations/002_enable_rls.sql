-- Migration: Enable Row Level Security on all tables

-- Enable RLS on usuarios table
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categorias table
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Enable RLS on saidas (expenses) table
ALTER TABLE saidas ENABLE ROW LEVEL SECURITY;

-- Enable RLS on entradas (incomes) table
ALTER TABLE entradas ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cartoes (cards) table
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on metas (goals) table
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

-- Enable RLS on meta_checkins table
ALTER TABLE meta_checkins ENABLE ROW LEVEL SECURITY;

-- Enable RLS on lancamentos_futuros (future launches) table
ALTER TABLE lancamentos_futuros ENABLE ROW LEVEL SECURITY;
