export const cloudSolutions = [
  {
    id: 'erp-private-cloud',
    category: 'ERP',
    name: 'ERP private cloud zone',
    short:
      'Finance, purchasing and inventory records move from local servers into isolated private subnets.',
    description:
      'The ERP platform is placed inside a VPC with private subnets, route tables and controlled outbound access through NAT. This protects finance and stock data while giving head office teams a reliable system for daily operations.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    metric: '99.9%',
    metricLabel: 'target availability',
    components: ['VPC', 'Private subnet', 'Route table', 'NAT gateway'],
    evidence: 'Supports A.P2, C.P5 and C.P6 by showing how cloud communication is designed and implemented.',
  },
  {
    id: 'crm-secure-access',
    category: 'CRM',
    name: 'CRM secure remote access',
    short:
      'Sales and customer-service staff connect to CRM through encrypted access and role-based controls.',
    description:
      'Client-to-site VPN and identity rules allow remote staff to reach CRM securely. Customer records are no longer tied to one office network, improving response time and customer experience.',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80',
    metric: '24/7',
    metricLabel: 'customer access',
    components: ['Client VPN', 'Firewall', 'IAM roles', 'DNS'],
    evidence: 'Supports B.P4 and D.P7 by explaining how remote clients use cloud services safely.',
  },
  {
    id: 'wms-warehouse-vpn',
    category: 'WMS',
    name: 'Warehouse WMS VPN network',
    short:
      'Regional warehouses, barcode scanners and stock systems connect through site-to-site VPN tunnels.',
    description:
      'Site-to-site VPN links the head office, regional warehouses and cloud-hosted WMS. The design keeps warehouse traffic encrypted while making order processing and stock updates visible in near real time.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    metric: '3x',
    metricLabel: 'faster order flow',
    components: ['Site-to-site VPN', 'Private subnet', 'WMS API', 'Monitoring'],
    evidence: 'Supports C.P5, C.M3 and D.M4 by focusing on performance and scalability tests.',
  },
  {
    id: 'load-balancing-autoscale',
    category: 'Scale',
    name: 'Load balancing and autoscaling',
    short:
      'Seasonal demand is handled by distributing traffic across multiple application instances.',
    description:
      'A load balancer routes requests to healthy web and API instances. Autoscaling adds resources during campaign peaks, then scales down to control cost when demand is normal.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    metric: '+60%',
    metricLabel: 'peak traffic capacity',
    components: ['Load balancer', 'Autoscaling', 'Health checks', 'CDN'],
    evidence: 'Supports C.M3 and C.D2 with tested performance and scaling results.',
  },
  {
    id: 'security-gateway-controls',
    category: 'Security',
    name: 'Firewall, gateway and zero-trust controls',
    short:
      'Public and private resources are separated so only approved traffic can reach business systems.',
    description:
      'Internet gateway, NAT gateway, firewall policies and network ACLs define clear traffic boundaries. The design reduces exposure and gives management a stronger security baseline for ERP, CRM and WMS.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    metric: '0 trust',
    metricLabel: 'security posture',
    components: ['Firewall', 'NAT gateway', 'Internet gateway', 'Network ACL'],
    evidence: 'Supports A.P1, A.M1 and A.D1 through architecture advantages and limitations.',
  },
  {
    id: 'cicd-cloud-release',
    category: 'DevOps',
    name: 'CI/CD cloud deployment pipeline',
    short:
      'The dynamic website and APIs are deployed through repeatable automated testing and release stages.',
    description:
      'Code moves from build to test, staging and production through a CI/CD pipeline. This lets the intern demonstrate cloud deployment, rollback and operational readiness for the business website.',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80',
    metric: '15m',
    metricLabel: 'release window',
    components: ['GitLab CI', 'Container image', 'Staging', 'Production'],
    evidence: 'Supports D.P8 by showing practical implementation of improvement recommendations.',
  },
]

export const cloudCategories = ['All', 'ERP', 'CRM', 'WMS', 'Scale', 'Security', 'DevOps']

export function findCloudSolution(id) {
  return cloudSolutions.find((solution) => solution.id === id)
}
