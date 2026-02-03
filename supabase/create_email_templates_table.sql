-- Tabla para Plantillas de Email
create table if not exists email_templates (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid references organizations(id) not null,
    name text not null,
    subject text,
    content text not null, -- Contenido HTML
    description text,
    category text default 'general', -- 'newsletter', 'promotional', 'transactional', 'general'
    thumbnail_url text, -- URL de imagen de vista previa
    variables jsonb default '[]'::jsonb, -- Lista de variables usadas ej: ['{{nombre}}', '{{empresa}}']
    is_default boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Políticas de Seguridad (RLS)
alter table email_templates enable row level security;

create policy "Users can view templates from their organization"
    on email_templates for select
    using (organization_id = (select organization_id from user_profiles where id = auth.uid()));

create policy "Users can insert templates for their organization"
    on email_templates for insert
    with check (organization_id = (select organization_id from user_profiles where id = auth.uid()));

create policy "Users can update templates from their organization"
    on email_templates for update
    using (organization_id = (select organization_id from user_profiles where id = auth.uid()));

create policy "Users can delete templates from their organization"
    on email_templates for delete
    using (organization_id = (select organization_id from user_profiles where id = auth.uid()));

-- Índices
create index if not exists idx_email_templates_org on email_templates(organization_id);
create index if not exists idx_email_templates_category on email_templates(category);

-- Insertar algunas plantillas de ejemplo (opcional)
-- Esto ayuda a que el usuario no vea la lista vacía al inicio
