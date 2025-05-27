export const getEndpointByOperationId = async (operationId) => {
  const response = await fetch("/openapi.json");
  const spec = await response.json();

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, config] of Object.entries(methods)) {
      if (config.operationId === operationId) {
        return {
          method: method.toUpperCase(),
          path: path,
        };
      }
    }
  }

  throw new Error(`Không tìm thấy operationId "${operationId}"`);
};