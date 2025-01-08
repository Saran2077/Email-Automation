class DashboardService {
    async getMetrics() {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from(`api:${process.env.API_KEY}`).toString('base64')
            }

            const events = [
                'accepted',
                'delivered',
                'failed',
                'opened',
                'clicked',
                'unsubscribed',
                'complained',
                'stored'
              ];
            
              const params = new URLSearchParams();
              
              events.forEach(event => {
                params.append('event', event);
              });
            
              try {
                const response = await fetch(
                  `https://api.mailgun.net/v3/stats/total?${params.toString()}`,
                  {
                    method: 'GET',
                    headers: headers
                  }
                );
            
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const data = await response.json();
                console.log(data)
                const totals = {};
                events.forEach(event => {
                    if (data.stats && Array.isArray(data.stats)) {
                      const total = data.stats.reduce((sum, dayStats) => {
                        // Each event is an object, we want to extract the total value
                        const eventData = dayStats[event];
                        if (eventData && typeof eventData === 'object' && 'total' in eventData) {
                          return sum + (Number(eventData.total) || 0);
                        }
                        return sum;
                      }, 0);
                      totals[event] = total;
                    } else {
                      totals[event] = 0;
                    }
                  });
            
                console.log('Total stats by event:');
                console.log(JSON.stringify(totals, null, 2));
                    
                return totals;
            } catch (error) {
                return error;
            }
    }
}

export default DashboardService