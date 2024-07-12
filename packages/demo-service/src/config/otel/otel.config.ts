import type { AppConfig } from '@mwcp/boot'


export const exporterEndpoint = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://localhost:4317'
export const otlpGrpcExporterConfig: AppConfig['otlpGrpcExporterConfig'] = {
  url: exporterEndpoint,
}

