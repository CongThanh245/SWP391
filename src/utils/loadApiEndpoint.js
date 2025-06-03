let cachedSpec = null;

export const getEndpointByOperationId = async (operationId) => {
  if (!cachedSpec) {
    const response = await fetch("/openapi.json");
    cachedSpec = await response.json();
  }

  for (const [path, methods] of Object.entries(cachedSpec.paths)) {
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