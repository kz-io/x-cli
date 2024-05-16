/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Exports the internal checkPermissions function.
 */

/**
 * Check if a permission is granted, and request it if not.
 *
 * @param permission The permission to check, and request if not granted.
 * @param request Whether to request the permission if not granted.
 *
 * @returns Whether the permission is granted.
 */
async function checkPermission(
  permission: Deno.PermissionDescriptor,
  request = true,
): Promise<boolean> {
  const status = await Deno.permissions.query(permission);

  if (status.state === 'granted') {
    return true;
  } else {
    if (!request) {
      return false;
    }

    const reqStatus = await Deno.permissions.request(permission);
    const granted = reqStatus.state === 'granted';

    return granted;
  }
}

/**
 * Check if a list of permissions are granted, and request them if not.
 *
 * @param permissions The permissions to check, and request if not granted.
 * @param request Whether to request the permission if not granted.
 *
 * @returns Whether all permissions are granted.
 */
export async function checkPermissions(
  permissions: Deno.PermissionDescriptor[],
  request = true,
): Promise<boolean> {
  let allGranted = true;

  for (const permission of permissions) {
    const granted = await checkPermission(permission, request);

    if (!granted) {
      allGranted = false;

      break;
    }
  }

  return allGranted;
}
