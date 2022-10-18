const SocialIcons = () => {
  return (
    <>
      <li className="ml-1 xl:ml-2 social-network">
        <a className="btn btn-outline-dark" href="https://twitter.com/MetricsDAO">
          <i className="bi bi-twitter"></i>
        </a>
      </li>
      <li className="ml-1 xl:ml-2 social-network">
        <a className="btn btn-outline-dark" href="https://docs.metricsdao.xyz/">
          <i className="bi bi-file-earmark-text-fill"></i>
        </a>
      </li>
      <li className="ml-1 xl:ml-2 social-network">
        <a className="btn btn-outline-dark" href="https://discord.gg/p3GMjK2zAr">
          <i className="bi bi-discord"></i>
        </a>
      </li>
    </>
  );
};

export default SocialIcons;
