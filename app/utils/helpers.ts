export function truncateAddress (address: String) {
    return address.substring(0, 5) + "..." + address.substring(address.length - 5);
}