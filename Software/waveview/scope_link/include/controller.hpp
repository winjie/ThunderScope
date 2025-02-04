#ifndef controller_hpp
#define controller_hpp

#include "dspPipeline.hpp"
#include "bridge.hpp"
#include "common.hpp"
#include "PCIe.hpp"

class controller
{
public:
    controller(boost::lockfree::queue<buffer*, boost::lockfree::fixed_sized<false>> *inputQ);
    ~controller(void);

    // Control Command Processor
    void controllerLoop();
    void controllerStop();
    void controllerFlush();
    void controllerUnPause();
    void controllerPause();
    void setLevel( int8_t newLevel );
    int8_t getLevel();
    void setCh(int8_t newCh);
    int8_t getCh();
    void setTriggerCh(int8_t newTriggerCh);
    int8_t getTriggerCh();
    bool getEdgeType();
    void setRising();
    void setFalling();
    uint32_t getWindowSize();
    void setWindowSize(uint32_t newSize);
    uint32_t getPerSize();
    void setPerSize(uint32_t newSize);
    void getMax(int8_t chNum, int8_t* value, uint64_t* pos);
    void getMin(int8_t chNum, int8_t* value, uint64_t* pos);
    void reProcess();
    void setMathCh_1(int8_t newCh);
    void setMathCh_2(int8_t newCh);
    void setMathSign(bool newSign);
    void getData();
    void setFileName(int8_t newFile);
    void hardWareCommand(int command, int channel, int val1, double val2);
    void testADCData();

private:
    // external queue
    boost::lockfree::queue<buffer*, boost::lockfree::fixed_sized<false>> *dataQueue;

    // Internal queues
    boost::lockfree::queue<buffer*, boost::lockfree::fixed_sized<false>> triggerProcessorQueue{1000};
    boost::lockfree::queue<int8_t*, boost::lockfree::fixed_sized<false>> processorPostProcessorQueue_1{1000};

    boost::lockfree::queue<EVPacket*, boost::lockfree::fixed_sized<false>> controllerQueue_tx{1000};
    boost::lockfree::queue<EVPacket*, boost::lockfree::fixed_sized<false>> controllerQueue_rx{1000};

    // internal threads
    Bridge* bridgeThread = NULL;
    Trigger* triggerThread = NULL;
    Processor* processorThread = NULL;
    postProcessor* postProcessorThread = NULL;
    PCIeLink* pcieLinkThread = NULL;
    

    // Control Command Processor
    std::thread controllerThread;

    std::atomic<bool> stopController;

    int8_t triggerLevel = 0;
};

enum CMD {
    //Data commands
    CMD_GetData1 = 0x01,
    CMD_GetData2 = 0x02,
    CMD_GetData3 = 0x03,
    CMD_GetData4 = 0x04,
    CMD_GetMin = 0x05,
    CMD_GetMax = 0x06,

    //Demo commands
    CMD_SetFile = 0x11,
    CMD_RampDemo = 0x1F,

    //Get Config commands
    CMD_GetWindowSize = 0x21,
    CMD_GetCh = 0x22,
    CMD_GetLevel = 0x23,
    CMD_GetTriggerCh = 0x24,
    CMD_GetEdgeType = 0x25,

    //Set Config commands
    CMD_SetWindowSize = 0x31,
    CMD_SetCh = 0x32,
    CMD_SetLevel = 0x33,
    CMD_SetTriggerCh = 0x34,
    CMD_SetEdgeType = 0x35,
    CMD_SetBandwidth = 0x36,
    CMD_SetVerticalScaling = 0x37,
    CMD_SetVerticalOffset = 0x38,
    CMD_SetHorizontalOffset = 0x39,
    CMD_SetCoupling = 0x3A,
    CMD_SetMath = 0x3F
};

//RampDemo related
#define RD_DATA_PER_CHAN 1024
#define RD_CHAN_COUNT 4
#define RD_PACKET_SIZE 4096

#endif
