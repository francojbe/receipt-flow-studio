// API endpoints for webhooks
const UPLOAD_URL = 'https://n8n.efinnovation.cl/webhook/Imagen';
const MANUAL_UPLOAD_URL = 'https://n8n.efinnovation.cl/webhook/Imagen';
const DASHBOARD_URL = 'https://n8n.efinnovation.cl/webhook/dashboard';
const CARTOLA_URL = 'https://n8n.efinnovation.cl/webhook/cartola';

export interface ManualEntry {
  monto: string;
  fecha: string;
  comercio: string;
  tipo: string;
}

export interface Movement {
  fecha: string;
  comercio: string;
  monto: number;
  tipo?: string;
  descripcion?: string;
  date?: string;
  amount?: number;
}

export interface KPIs {
  diario: number;
  semanal: number;
  mensual: number;
  comparativa_ayer: number;
}

export interface ChartDataPoint {
  dia: string;
  monto: number;
}

export interface DashboardData {
  kpis: KPIs;
  ultimos_movimientos: Movement[];
  grafico: ChartDataPoint[];
}

export interface CartolaData {
  fecha?: string;
  comercio?: string;
  descripcion?: string;
  monto?: number;
  date?: string;
  amount?: number;
}

// Upload image file
export async function uploadImage(file: File, userId: string, userEmail?: string, userName?: string): Promise<boolean> {
  console.log('📤 Subiendo imagen...');
  console.log('👤 Usuario:', userId, userEmail, userName);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  if (userEmail) formData.append('user_email', userEmail);
  if (userName) formData.append('user_name', userName);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  return response.ok;
}

// Submit manual entry
export async function submitManualEntry(entry: ManualEntry, userId: string, userEmail?: string, userName?: string): Promise<boolean> {
  console.log('📝 Enviando registro manual...');
  console.log('👤 Usuario:', userId, userEmail, userName);

  const response = await fetch(MANUAL_UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...entry, user_id: userId, user_email: userEmail, user_name: userName }),
  });

  return response.ok;
}

// Fetch dashboard data
export async function fetchDashboard(year: number, month: string): Promise<DashboardData> {
  const queryDate = `${year}-${month}`;

  const response = await fetch(DASHBOARD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha: queryDate, mes: month, anio: year }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  const rawData = await response.json();
  const data = Array.isArray(rawData) ? rawData[0] : rawData;

  return {
    kpis: data.kpis || data,
    ultimos_movimientos: data.ultimos_movimientos || [],
    grafico: data.grafico || [],
  };
}

// Fetch cartola data
export async function fetchCartola(year: string, month: string, userId: string): Promise<CartolaData[]> {
  const monthInput = `${year}-${month}`;

  const response = await fetch(CARTOLA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha: monthInput, mes: month, anio: year, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  let rows: CartolaData[] = [];

  if (Array.isArray(data) && data.length > 0 && data[0].ultimos_movimientos) {
    rows = data[0].ultimos_movimientos;
  } else if (Array.isArray(data)) {
    if (data.length > 0 && (data[0].fecha || data[0].monto)) {
      rows = data;
    }
  } else if (data.ultimos_movimientos) {
    rows = data.ultimos_movimientos;
  }

  // Sort by date descending
  rows.sort((a, b) => new Date(b.fecha || b.date || '').getTime() - new Date(a.fecha || a.date || '').getTime());

  return rows;
}
